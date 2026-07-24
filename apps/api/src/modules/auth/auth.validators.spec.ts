import { LoginBody, RegisterBody, User } from '@repo/validators';

describe('Auth validators', () => {
  it('parses RegisterBody / LoginBody / User', () => {
    const registered = RegisterBody.parse({
      email: 'ada@example.com',
      password: 'Str0ngPass!',
      name: 'Ada',
    });
    expect(registered.email).toBe('ada@example.com');

    const login = LoginBody.parse({
      email: 'ada@example.com',
      password: 'Str0ngPass!',
    });
    expect(login.password).toBe('Str0ngPass!');

    const user = User.parse({
      id: '11111111-1111-1111-1111-111111111111',
      email: 'ada@example.com',
      name: 'Ada',
      role: 'user',
    });
    expect(user.role).toBe('user');
  });

  it('rejects short register passwords', () => {
    expect(() =>
      RegisterBody.parse({
        email: 'ada@example.com',
        password: 'short',
        name: 'Ada',
      }),
    ).toThrow();
  });
});
