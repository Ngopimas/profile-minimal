---
author: Romain C.
pubDatetime: 2026-06-07T10:00:00Z
title: "The correction is the problem"
slug: correction-itself-needs-correction
featured: false
draft: false
tags: ["tdd", "code-review", "testing", "bias", "software-engineering"]
description: "TDD biases toward testable code. Code review biases toward reviewer taste. Every fix introduces its own distortions."
---

I adopted TDD on a project two years ago. I wanted fewer bugs. I got fewer bugs and an architecture that looked like it had been designed by a test runner.

The code worked. Coverage was above 80 percent. Methods were small, pure, and injected with dependencies everywhere. Every class had an interface. Every function took its dependencies as arguments. Everything was testable. Nothing was pleasant to read.

The design had a name for the shape it was in: it was maximally testable and minimally comprehensible. Every decision had been made to make the next test easier to write. The architecture was a side effect of the testing strategy.

TDD did what TDD does. It biased the code toward testability. Testability is a good goal. It is not the only goal. The things that got squeezed out: performance characteristics that are hard to unit test, user experience that is hard to assert, behavior that only shows up when the system runs as a whole.

The correction introduced its own distortion. I think about this with every process now.

## TDD's hidden distortions

TDD is popular for good reason. Writing tests first forces you to think about the interface before the implementation. The tests document what the code is supposed to do. Regressions get caught early. I still write tests first for important logic.

TDD also creates predictable distortions.

**Testable design over good design.** Pure functions with injected dependencies are easy to test. They are not always the right architecture. Sometimes a tightly-coupled module is the pragmatic choice. TDD punishes that choice because it is hard to unit test. The result is code that is well-tested and unnecessarily complex.

**Coverage over correctness.** A test suite with 90 percent coverage does not have 90 percent correctness. It has 90 percent of lines executed by tests. The tests might assert the wrong things. I have seen tests that verify the code does exactly what it does, including the bugs. The test passes. The code is wrong. The coverage metric is green.

**The refactor loop trap.** TDD says write a test, watch it fail, write the code, watch it pass, refactor. The refactor step is where design happens. In practice, people use the refactor step to make the code prettier. "Prettier" usually means more generic. More generic means more abstract. More abstract means harder to read three months later.

The lesson was not "TDD is bad." The lesson was: every process optimizes for something. Know what your process optimizes for. Design review catches what test-first development misses. Performance testing catches what unit testing misses. No single process covers everything.

## What code review optimizes for

Code review catches bugs, style violations, and knowledge gaps. It also reinforces whoever reviews most.

**Reviewer taste becomes team pattern.** A reviewer prefers early returns. Suddenly the codebase has early returns everywhere. Another reviewer prefers descriptive variable names. The codebase gets verbose. A third reviewer prefers functional style. The codebase gets map-filter-reduce chains that are harder to debug than a loop.

None of these are wrong. They are preferences. Code review turns preferences into patterns through repetition. The contributors learn to write what the reviewers approve.

**"Looks good to me" is the default.** A thorough review takes 30 minutes. A quick scan takes 5. The quick scan catches syntax errors. The thorough review catches design problems and missing edge cases. Most reviews are quick scans. The incentive structure guarantees it: reviewers are busy, the queue is long, and "looks good" is the path of least resistance.

**Knowledge flows in one direction.** An experienced developer reviews a newer developer's PR. The reviewer marks it "changes requested" with a list of things to fix. The author fixes them. The author does not push back because the reviewer has more context, more authority, or simply more tenure. The result is code that reflects one person's taste.

This is not a problem with code review. It is a problem with how code review usually works. The process optimizes for "does this match what the reviewer expects" not "is this the right design."

## Other corrections, same pattern

**Linting** catches syntax errors and style violations. It also creates linting-for-linting's-sake. Every team has a lint rule nobody understands but nobody wants to remove because "it might catch something." The codebase gets cleaner. The contributor gets more annoyed.

**Type systems** catch type errors at compile time. They also create type gymnastics when the type system cannot express what the programmer means. I have seen TypeScript types longer than the code they describe. The types are correct. They are also unreadable.

**CI/CD** catches broken builds. It also creates pipeline-optimization-as-a-goal. Teams spend more time configuring CI than writing application code. The pipeline has 15 stages. Each stage takes 2 minutes. The deployment takes 30 minutes. The code change took 10 minutes.

Every process has benefits. Every process has costs. The costs are usually invisible until they compound.

## Naming the distortion

I started naming the distortions explicitly with my team.

When we adopted TDD, we said: "TDD will bias us toward testable code. We will review for performance and user experience separately." The name made the distortion visible. Instead of arguing about whether TDD was good or bad, we talked about what it was making us miss.

When a reviewer kept requesting the same style change, we said: "This is reviewer preference. It is valid but it is preference, not correctness." The distinction matters. Preferences are fine. Pretending preferences are correctness is how codebases become inconsistent.

I also do periodic counter-corrections. After a month of TDD-focused development, we review: what are we not seeing because of our process? The answer is usually something about integration behavior or performance under load. We add a different kind of review to catch it.

The meta-process matters. Reviewing the review process. Auditing the audit.

## The only useful question

Not "which process is correct?" The answer to that is "all of them and none of them."

The question is: what does our current process make invisible?

If TDD makes performance invisible, add a performance review step. If code review makes design invisible, add a design review. If linting makes contributor experience invisible, audit the lint rules.

Every process has blind spots. Naming them is the first step. Correcting for them is the second. The third step is accepting that the correction will also have blind spots.

The goal is not a bias-free process. That does not exist. The goal is a process that knows its own biases, so you can account for them before they cost you.

The most dangerous bias is the one introduced by the fix. It comes disguised as rigor. The team that adopted TDD and called it quality. The team that added linting and called it standards. The team that added CI gates and called it reliability. Each process helped. each process also narrowed the team's view.

Build processes that know what they cannot see. That is harder than building processes that catch everything. It is the only thing that works.
