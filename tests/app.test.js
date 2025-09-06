const request = require('supertest');

// load test env before app
require('./setup');
const app = require('..');

describe('Notes API smoke and auth flow', () => {
  it('GET / should return ok', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('auth signup -> verify -> login -> CRUD notes', async () => {
    const user = { name: 'Test', email: `u${Date.now()}@x.test`, phone: '1234567890', password: 'Password1!' };

    // signup
    const s1 = await request(app).post('/api/auth/signup').send(user);
    expect(s1.status).toBe(201);
    expect(s1.body.demoOtp).toBeDefined();

    // verify
    const v1 = await request(app).post('/api/auth/verify-otp').send({ email: user.email, otp: s1.body.demoOtp });
    expect(v1.status).toBe(200);

    // login
    const l1 = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    expect(l1.status).toBe(200);
    expect(l1.body.token).toBeDefined();

    const token = l1.body.token;

    // list notes (empty)
    const list0 = await request(app).get('/api/notes').set('Authorization', `Bearer ${token}`);
    expect(list0.status).toBe(200);
    expect(Array.isArray(list0.body.notes)).toBe(true);

    // create note
    const n1 = await request(app).post('/api/notes').set('Authorization', `Bearer ${token}`).send({ title: 'First', content: 'Hello' });
    expect(n1.status).toBe(201);
    const noteId = n1.body.note.id;

    // get note
    const g1 = await request(app).get(`/api/notes/${noteId}`).set('Authorization', `Bearer ${token}`);
    expect(g1.status).toBe(200);

    // update note
    const u1 = await request(app).put(`/api/notes/${noteId}`).set('Authorization', `Bearer ${token}`).send({ content: 'Updated' });
    expect(u1.status).toBe(200);
    expect(u1.body.note.content).toBe('Updated');

    // delete note
    const d1 = await request(app).delete(`/api/notes/${noteId}`).set('Authorization', `Bearer ${token}`);
    expect(d1.status).toBe(200);
  });
});
