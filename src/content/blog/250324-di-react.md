---
author: Romain C.
pubDatetime: 2025-03-24T17:30:00Z
title: "You Probably Don't Need Dependency Injection in React"
featured: false
draft: false
tags: ["react", "testing", "architecture", "typescript"]
description: "DI in React: when it helps, when it gets in the way, and how to do it without overengineering."
---

I used to think Dependency Injection was something Java developers argued about while React devs just imported what they needed and moved on. But after refactoring a codebase where half the components were married to a specific API client, I changed my mind.

DI in React isn't about frameworks or containers. It's about not hard-coding dependencies so you can swap them out later - usually for tests.

## The Mess It Fixes

Here's the pattern I see everywhere:

```tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(setUser)
      .catch(console.error);
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  return <div>{user.name}</div>;
}
```

It works. Until you want to test it without hitting the real API, or reuse it with a GraphQL endpoint, or mock it in Storybook. Then you're stuck.

## Props: The Simplest Fix

Pass the dependency as a prop:

```tsx
interface UserService {
  getUser: (id: string) => Promise<User>;
}

function UserProfile({
  userId,
  userService,
}: {
  userId: string;
  userService: UserService;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userService.getUser(userId).then(setUser);
  }, [userId, userService]);

  if (!user) return <p>Loading...</p>;

  return <div>{user.name}</div>;
}

// Usage
const userService: UserService = {
  getUser: async id => fetch(`/api/users/${id}`).then(res => res.json()),
};

<UserProfile userId="123" userService={userService} />;
```

Now you can hand in a mock for tests:

```tsx
const mockUserService: UserService = {
  getUser: jest.fn().mockResolvedValue({ id: "1", name: "John Doe" }),
};

render(<UserProfile userId="1" userService={mockUserService} />);
expect(mockUserService.getUser).toHaveBeenCalledWith("1");
```

No magic. Just props.

## Context: When Props Become Tedious

If you're threading the same service through five layers of components, Context is cleaner:

```tsx
const UserServiceContext = createContext<UserService | null>(null);

export function UserServiceProvider({
  children,
  userService,
}: {
  children: React.ReactNode;
  userService: UserService;
}) {
  return (
    <UserServiceContext.Provider value={userService}>
      {children}
    </UserServiceContext.Provider>
  );
}

export function useUserService() {
  const service = useContext(UserServiceContext);
  if (!service) throw new Error("UserServiceProvider is missing");
  return service;
}

// Usage
<UserServiceProvider userService={userService}>
  <UserProfile userId="123" />
</UserServiceProvider>;
```

## When You Actually Need This

- The app is large enough that you have multiple implementations of the same thing (real API, mock API, cached API).
- You write tests and you're tired of mocking `fetch` globally.
- You're building a library and don't know what backend the consumer will use.

## When You Don't

- A prototype with a two-week lifespan.
- A page with one API call that never changes.
- Any situation where the "abstraction" is just wrapping `fetch` with no real benefit.

I've seen teams introduce DI layers so complex they needed documentation. The goal is looser coupling, not more architecture.

## Further Reading

- [React Context Documentation](https://reactjs.org/docs/context.html)
- [Testing React Applications](https://testing-library.com/docs/react-testing-library/intro/)
- [Inversion of Control](https://martinfowler.com/articles/injection.html)
