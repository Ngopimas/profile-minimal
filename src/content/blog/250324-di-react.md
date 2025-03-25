---
author: Romain C.
pubDatetime: 2025-03-24T17:30:00Z
title: "Dependency Injection in React?"
featured: false
draft: false
tags: ["react", "testing", "architecture", "typescript"]
description: "Benefits and trade-offs of using Dependency Injection pattern in React"
---

Dependency Injection (DI) is a design pattern often associated with backend languages like Java or C#. However, it can also be a powerful tool in React applications, improving testability, flexibility, and maintainability. Let's explore when and how to use DI effectively in React.

## The Problem: Tightly Coupled Dependencies

Consider this common scenario in React:

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

This approach tightly couples the component to the `fetch` API, making it hard to test, reuse, or switch implementations.

## What is Dependency Injection?

Dependency Injection allows components to receive their dependencies externally rather than creating them internally. This decouples components from specific implementations.

### Benefits

- **Loose Coupling**: Components depend on abstractions, not implementations.
- **Testability**: Dependencies can be mocked for testing.
- **Flexibility**: Swap implementations without changing component logic.

### Challenges

- **Complexity**: Requires additional setup.
- **Learning Curve**: Team members must understand DI principles.

## DI Implementation Patterns in React

### 1. Props-Based Injection

The simplest form of DI is passing dependencies as props:

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

### 2. Context-Based Injection

For larger applications, the Context API provides a scalable DI solution:

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

### 3. Advanced Patterns (Optional)

For complex applications, consider splitting contexts or memoizing services to optimize performance.

## When to Use DI

### Good Use Cases

- Large applications with complex dependencies
- Applications requiring extensive testing
- Scenarios with multiple implementation variants

### When to Avoid

- Small or simple applications
- Performance-critical components
- Rapid prototypes

## Testing with DI

DI simplifies testing by allowing you to mock dependencies:

```tsx
const mockUserService: UserService = {
  getUser: jest.fn().mockResolvedValue({ id: "1", name: "John Doe" }),
};

render(<UserProfile userId="1" userService={mockUserService} />);
expect(mockUserService.getUser).toHaveBeenCalledWith("1");
```

## Conclusion

Dependency Injection in React enhances flexibility, testability, and maintainability but comes with added complexity. Start simple with props-based injection and evolve to context-based DI as your application grows. Always weigh the trade-offs before adopting DI.

### TL;DR

1. Use DI to decouple components from specific implementations.
2. Start with simple patterns and scale as needed.
3. Prioritize maintainability and testability over unnecessary abstraction.

## Further Reading

- [React Context Documentation](https://reactjs.org/docs/context.html)
- [Testing React Applications](https://testing-library.com/docs/react-testing-library/intro/)
- [Inversion of Control](https://martinfowler.com/articles/injection.html)
