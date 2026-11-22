---
author: Romain C.
pubDatetime: 2026-12-01T08:00:00Z
title: "I removed a feature from search and seven agents' tests stayed green"
slug: seven-agents-tests-stayed-green
featured: false
draft: false
tags: ["ai", "agents", "testing", "automation", "software-engineering"]
description: "Software factories judge agent-written code with scenarios the agent cannot see. I tried that on this blog. Hiding the scenarios did not change who passed. Removing the feature afterwards showed which checks were worth having."
---

Seven sessions of a cheap model each built the same small feature on this blog and wrote tests for it. All seven passed an outside set of acceptance checks. Then I deleted one line in each, so that the feature no longer appeared in search results, and ran their tests again. All seven suites stayed green, because they checked the files the build produced and the bug was in what the browser draws.

I had not set out to test the agents' tests. I wanted to try one idea from the "software factory" write-ups, and the search bug is what I found on the way.

## The idea I borrowed

StrongDM runs a [software factory](https://factory.strongdm.ai/) on two rules most teams would not sign: "Code must not be written by humans" and "Code must not be reviewed by humans". If nobody reads the code, something else has to say whether it works, and they are blunt about why the agent's own tests cannot do it: "return true is a great way to pass narrowly written tests", and a test stored in the codebase "can be lazily rewritten to match the code".

Their answer is the scenario, an end-to-end user story kept outside the codebase, in the way a holdout set is kept away from a model in training. The agent builds, the scenarios judge, and the agent does not see the exam.

I cannot afford their factory and I like reading code. Hidden scenarios, though, cost one extra session.

## The setup

The request was one sentence: show an estimated reading time on each blog post page and next to each post in the post lists. The blog already did about half of that, which I knew from [challenging a plan for this same request](/posts/fresh-model-eight-problems-in-a-plan/) in an earlier post.

A fresh Opus session wrote the scenarios. It got the request and a built copy of the site, with instructions to describe what a visitor would observe and to name no file or function. It wrote nine, plus a checker script. The seventh is the one the rest of this post turns on:

```text
S7: Search results
A visitor searches the site, for example for "react" or "git", and
every blog post in the results shows an estimated reading time.
Check: results are rendered in the browser, so this uses the headless
browser. Count the post results and the post results showing an
estimate. The two must be equal.
```

I froze the files with a checksum and ran them on the untouched site. Six of the nine already passed. The three that failed covered the topic pages, the later pages of each topic, and search results. Only those three can tell a finished feature from an untouched site, so from here on I count out of three.

Then Haiku sessions implemented the request, each in its own git worktree, each told to add whatever tests it judged necessary. Haiku is Anthropic's cheap model and Opus its strong one. Three sessions never saw the scenarios. Three could read them and run the checker. A seventh, added later, never saw them but was offered a headless browser.

## Hiding the scenarios did not change who passed

| Arm                               | Runs | Passed 3 of 3 | Edited a switched-off page | Tokens per run |
| --------------------------------- | ---- | ------------- | -------------------------- | -------------- |
| Scenarios hidden                  | 3    | 3             | 3                          | about 67,000   |
| Scenarios hidden, browser offered | 1    | 1             | 1                          | 71,000         |
| Scenarios visible                 | 3    | 3             | 0                          | about 79,000   |

Every run passed. The blind runs reported the same gaps the scenario writer had found, the topic pages and the search results.

The arms differed in one way. All four blind runs also edited the timeline page, which is switched off in this site's config and redirects to a 404. None of the visible runs touched it, because the scenario file lists it as out of scope. So seeing the scenarios kept stray edits out of the diff. It did not make the runs cheaper: they spent more tokens, some of it on reading and running the checker. I had expected the hidden arm to do worse on the scenarios, and it did not.

Seven passes out of seven left me with a check that had never failed on a finished implementation, and I could not tell whether that was good news. Birgitta Böckeler puts the question well in her [article on harness engineering](https://martinfowler.com/articles/harness-engineering.html): "If sensors never fire, is that a sign of high quality or inadequate detection mechanisms?" The cheap way to answer is to break something on purpose.

## Breaking it

I made two one-line breaks in every implementation, one at a time, rebuilt, and ran the agent's own tests and the scenarios. This is mutation testing done by hand, on two mutations.

| Break                             | Agents' own tests notice | Scenarios notice |
| --------------------------------- | ------------------------ | ---------------- |
| Topic pages lose the reading time | 7 of 7                   | 7 of 7           |
| Search results stop showing it    | 0 of 7                   | 7 of 7           |

I chose both breaks myself, and I chose the second knowing search was the hard part to test. So read the table as proof that a blind spot exists, and no more: two hand-picked breaks cannot grade seven test suites.

Search results on this site are drawn in the browser after the page loads. Five of the seven agents wrote a search test, and each tested the build output. This one is typical:

```js
test("search results carry a reading time for posts", async () => {
  const html = await readFile("dist/search/index.html", "utf8");
  assert.match(html, /\d+ min read/);
});
```

After my break, the reading time was still in the data shipped with the page, so the pattern still matched, although no visitor could see it any more. One agent had said as much in its report: "Search tests only check that the value is serialized into the page." The other two wrote no search test at all.

## Why the outside check caught it

The scenario writer differed from the implementers in three ways at once: it was a stronger model, it was told to use a browser, and it never saw the code change. I looked at each difference with what I had, which is one session or one arm apiece.

| What I varied                      | Sessions        | Did it catch the search break?                     |
| ---------------------------------- | --------------- | -------------------------------------------------- |
| Implementer can read the scenarios | 3 (visible arm) | No. Two tested the build output, one wrote no test |
| Implementer is offered a browser   | 1               | No. It did not use the browser                     |
| Cheap model writes the scenarios   | 1               | Its search check fails on correct and broken sites |
| Strong model writes the scenarios  | 1               | Yes, on all seven implementations                  |

The visible runs read S7, ran the browser check and watched it pass. Two then wrote their own search test against the build output anyway, and the third skipped it because the checker covered it.

The seventh implementer had the path to the headless browser and the command to serve the site. Its report says "search results were not checked in a browser".

The Haiku judge got the Opus judge's exact brief and did write a browser check for search. That check reported 0 of 48 results with an estimate on a correct implementation, where Opus's checker counted them all. It had failed on the untouched site too, which is what a search check should do there, so nothing looked wrong. I did not debug it. The Opus session had tested its checker in both directions before handing it over, against copies of the site with the estimates removed, added, and wrong. Nothing in the brief asked for that.

One judge per model is thin evidence, and nothing here isolates "never saw the code". What I can say is that the one check that worked came from a separate session on a stronger model, whose only job was to judge what a visitor sees, and which made sure its own checks could both pass and fail.

## What it cost

| Session                       | Tokens  | Time   |
| ----------------------------- | ------- | ------ |
| Scenarios and checker (Opus)  | 134,000 | 15 min |
| Scenarios and checker (Haiku) | 93,000  | 5 min  |
| One implementation (Haiku)    | 67,000  | 90 s   |

The useful judge cost 1.7 to 2 times the tokens of one implementation, on a model whose tokens cost several times more. For a one-line feature I would not pay that. The sum changes with reuse: one set of scenarios judged all seven runs here, and it would judge any later change to those pages.

## What I am keeping

A judge that is separate from the builder, with scenarios written from the running site. For one-shot work like this I will hand the scenarios to the implementer as part of the spec, since hiding them only made the blind runs wander. Whether secrecy matters when an agent iterates against a failing check is the case StrongDM designed it for, and I did not test it.

I am also keeping code review. The largest deployment I read about, Stripe's Minions, [merges over 1,300 pull requests a week](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2) that are "completely minion-produced, human-reviewed". And Addy Osmani's [rule](https://addyosmani.com/blog/software-factories/) describes my seven agents exactly: give agents "as much autonomy as you can cheaply and reliably verify". They verified what was cheap to reach, and I only found out by breaking something.

## What this does not show

It was one small feature, half built already, on a small codebase, with three runs per arm and one cheap model. A harder task could separate the arms.

Hidden scenarios exist to stop an agent gaming its tests while it iterates under pressure. My runs were one-shot and none of them tried to game anything, so the case StrongDM built the idea for went untested.

Counting search results as a "post list" is an interpretation of the request. I think it is a fair one, and another owner could disagree.

## If you try this

- Have a separate session write the scenarios from the running product, before it sees any code change.
- Make it prove each check can fail and can pass. A checker that only ever failed looked exactly like a working one on the untouched site.
- Run the scenarios on the untouched site first, and count only the ones that fail there.
- After a green run, break the feature in one line and see which tests notice.
- Give the scenarios to the implementer, including the list of what is out of scope.
- Send anything that renders in a browser through a browser. None of my seven implementers did it unprompted.
