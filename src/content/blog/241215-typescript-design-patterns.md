---
author: Romain C.
pubDatetime: 2024-12-15T10:00:00Z
title: "Design Patterns in TypeScript"
slug: typescript-design-patterns
featured: true
draft: false
tags: ["typescript", "design-patterns", "software-engineering"]
description: "A quick guide to essential design patterns in TypeScript"
---

Design patterns are proven solutions to common problems in software design. They provide a template for writing code that is easy to understand, maintain, and extend. Let's explore five essential design patterns in TypeScript: Singleton, Factory, Observer, Strategy, and Decorator.

## 1. Singleton Pattern

### What is it?

The Singleton pattern ensures that a class has only one instance and provides a global point of access to it.

### Implementation

```typescript
class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

const loggerA = Logger.getInstance();
const loggerB = Logger.getInstance();
loggerA.log("Singleton pattern example");
console.log(loggerA === loggerB); // true
```

### Pros and Cons

**Pros:**

- Controlled access to the single instance.
- Reduces the need for global variables.

**Cons:**

- Can make unit testing tricky.
- May introduce hidden dependencies.

## 2. Factory Pattern

### What is it?

The Factory pattern provides a way to create objects without specifying the exact class of object that will be created.

### Implementation

```typescript
interface Notification {
  send(message: string): void;
}

class EmailNotification implements Notification {
  send(message: string): void {
    console.log(`Sending email: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(message: string): void {
    console.log(`Sending SMS: ${message}`);
  }
}

class NotificationFactory {
  public static createNotification(type: string): Notification {
    switch (type) {
      case "email":
        return new EmailNotification();
      case "sms":
        return new SMSNotification();
      default:
        throw new Error("Unknown notification type");
    }
  }
}

const emailNotification = NotificationFactory.createNotification("email");
emailNotification.send("Hello via Email!");

const smsNotification = NotificationFactory.createNotification("sms");
smsNotification.send("Hello via SMS!");
```

### Pros and Cons

**Pros:**

- Encapsulates object creation logic.
- Makes it easier to add new types of products.

**Cons:**

- Can introduce complexity for simple object creation.

## 3. Observer Pattern

### What is it?

The Observer pattern allows an object (subject) to notify other objects (observers) about changes in its state.

### Implementation

```typescript
class WeatherStation {
  private temperature: number = 0;
  private observers: Observer[] = [];

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  setTemperature(temp: number): void {
    console.log(`WeatherStation: new temperature measurement: ${temp}`);
    this.temperature = temp;
    this.notifyObservers();
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.temperature);
    }
  }
}

interface Observer {
  update(temperature: number): void;
}

class TemperatureDisplay implements Observer {
  update(temperature: number): void {
    console.log(
      `TemperatureDisplay: I need to update my display to ${temperature}`
    );
  }
}

const weatherStation = new WeatherStation();
const tempDisplay = new TemperatureDisplay();

weatherStation.addObserver(tempDisplay);
weatherStation.setTemperature(25);
weatherStation.setTemperature(30);
```

### Pros and Cons

**Pros:**

- Promotes loose coupling.
- Supports broadcast communication.

**Cons:**

- Can be complex to manage with many observers.

## 4. Strategy Pattern

### What is it?

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.

### Implementation

```typescript
class PaymentContext {
  private strategy: PaymentStrategy;

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  executeStrategy(amount: number): void {
    this.strategy.pay(amount);
  }
}

interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(`Paid ${amount} using Credit Card`);
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number): void {
    console.log(`Paid ${amount} using PayPal`);
  }
}

const paymentContext = new PaymentContext();
paymentContext.setStrategy(new CreditCardPayment());
paymentContext.executeStrategy(100); // Paid 100 using Credit Card

paymentContext.setStrategy(new PayPalPayment());
paymentContext.executeStrategy(200); // Paid 200 using PayPal
```

### Pros and Cons

**Pros:**

- Allows easy switching of algorithms.
- Promotes open/closed principle.

**Cons:**

- Increases the number of classes.

## 5. Decorator Pattern

### What is it?

The Decorator pattern allows behavior to be added to individual objects, dynamically, without affecting the behavior of other objects from the same class.

### Implementation

```typescript
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost(): number {
    return 5;
  }

  description(): string {
    return "Simple coffee";
  }
}

class MilkDecorator implements Coffee {
  constructor(private coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost() + 2;
  }

  description(): string {
    return `${this.coffee.description()} with milk`;
  }
}

class SugarDecorator implements Coffee {
  constructor(private coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost() + 1;
  }

  description(): string {
    return `${this.coffee.description()} with sugar`;
  }
}

let coffee: Coffee = new SimpleCoffee();
console.log(`${coffee.description()} costs $${coffee.cost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()} costs $${coffee.cost()}`);

coffee = new SugarDecorator(coffee);
console.log(`${coffee.description()} costs $${coffee.cost()}`);
```

### Pros and Cons

**Pros:**

- Flexible alternative to subclassing.
- Can add responsibilities to objects dynamically.

**Cons:**

- Can lead to a large number of small classes.

## Conclusion

Design patterns are essential tools in a developer's toolkit. They provide solutions to common problems and help create code that is maintainable and scalable. Understanding and applying these patterns in TypeScript improve the quality of the codebase.

## Further Reading

- [Refactoring Guru: Design Patterns](https://refactoring.guru/design-patterns)
- [Head First Design Patterns](https://www.oreilly.com/library/view/head-first-design/0596007124/)
- [Top 5 Essential JavaScript Design ](https://blogs.thnkandgrow.com/mastering-javascript-top-5-design-patterns//)
