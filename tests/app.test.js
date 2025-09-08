// Very simple (novice-style) API tests
// Make sure we load the DB setup first
require('./setup');

const request = require('supertest');
const app = require('..');

// give tests more time (Mongo can take a bit to start)
jest.setTimeout(90000);

describe('Notes API basic tests', () => {
  let email;
  let password;
  let token;
  let noteId;

  it('GET / should say ok', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.message).toBe('string');
  });

  it('can signup and verify', async () => {
    email = 'user' + Date.now() + '@test.com';
    password = 'Password1!';

    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: email, phone: '1234567890', password: password });

    expect(signupRes.status).toBe(201);
    expect(signupRes.body).toBeDefined();
    expect(signupRes.body.demoOtp).toBeDefined();

    const otp = signupRes.body.demoOtp;

    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email: email, otp: otp });
    expect(verifyRes.status).toBe(200);
  });

  it('can login and get a token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: email, password: password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toBeDefined();
    expect(loginRes.body.token).toBeDefined();
    token = loginRes.body.token;
  });

  it('notes list is empty at first', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.notes)).toBe(true);
    // should be 0 on a new account
    expect(res.body.notes.length).toBe(0);
  });

  it('can create a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', 'Bearer ' + token)
      .send({ title: 'My First Note', content: 'Hello' });
    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.note).toBeDefined();
    noteId = res.body.note.id;
    expect(typeof noteId).toBe('string');
  });

  it('can get that note', async () => {
    const res = await request(app)
      .get('/api/notes/' + noteId)
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.note).toBeDefined();
    expect(res.body.note.id).toBe(noteId);
  });

  it('can update the note', async () => {
    const res = await request(app)
      .put('/api/notes/' + noteId)
      .set('Authorization', 'Bearer ' + token)
      .send({ content: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.note.content).toBe('Updated');
  });

  it('can delete the note', async () => {
    const res = await request(app)
      .delete('/api/notes/' + noteId)
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
  });
});
