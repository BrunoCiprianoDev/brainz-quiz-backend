describe('CreateUser functional tests', () => {
  test('Should create user sucessfully', async () => {

    const input = {
      email: 'cipriano990@gmail.com',
      password: 'p@ssw0rd',
      confirmPassword: 'p@ssw0rd',
    };

    const { body, status } = await global.testRequest.post('/users').send(input);

    expect(status).toBe(201);
    expect(body).toHaveProperty('email', 'cipriano990@gmail.com');
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('role', "PLAYER");
  });
});
