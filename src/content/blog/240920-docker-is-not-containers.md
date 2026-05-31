---
author: Romain C.
pubDatetime: 2024-09-20T10:00:00Z
title: "Docker is not containers"
slug: docker-is-not-containers
featured: false
draft: false
tags: ["docker", "containers", "linux", "devops", "first-principles"]
description: "Docker is a product. Containers are primitives. When Docker breaks, you are debugging a layer you cannot see."
---

I spent four hours debugging a Docker networking issue last month. The fix was three iptables rules. Docker was hiding them.

That was not a Docker bug. It was a Docker feature. The product was doing its job, which is keeping me from thinking about Linux. That works until it does not.

Most developers learn Docker and containers at the same time. They learn `docker run`, then `docker compose`, then maybe `docker build`. They never learn `unshare`, `cgroups`, or `mount --bind`. Docker is the whole thing. Containers are what Docker does.

This is the same mistake people made with Git and GitHub. Git is a tool. GitHub is a product. Docker is a product. Containers are primitives. The product hides the substrate you need to understand.

## What a container actually is

A container is three Linux features working together. Nothing more.

**Namespaces** give a process its own view of the system. A PID namespace means your process thinks it is PID 1, even though it is PID 48291 on the host. A network namespace means your process has its own IP address, its own routing table, its own ports. A mount namespace means your process sees its own filesystem.

You can run this right now:

```bash
sudo unshare --pid --mount --fork /bin/bash
ps aux
```

You will see one process: your shell. It thinks it is PID 1. It is lying. The host has thousands of processes. Your namespace just cannot see them.

**cgroups** limit what a process can use. CPU time, memory, I/O bandwidth. A cgroup is a ceiling. Your process can use up to 512MB of memory, but not more. The kernel enforces this. Docker does not enforce it. Docker configures the cgroup. The kernel does the work.

You can see your own cgroup right now:

```bash
cat /proc/self/cgroup
```

On a modern system you will see a path like `/user.slice/user-1000.slice/...`. That is your cgroup. Every process on your machine is in one. Docker just creates a new one for each container.

**rootfs** is the filesystem a container sees. It is usually an overlay filesystem, which means multiple layers stacked on top of each other. The base layer is your image. The top layer is whatever the container writes. When the container stops, the top layer disappears.

```bash
mount | grep overlay
```

You will see something like `overlay on /var/lib/docker/overlay2/...`. That is the container filesystem. It is a mount point, not a magic trick.

That is it. Namespaces, cgroups, rootfs. Three features the Linux kernel already has. Docker did not invent them. Docker packages them.

## What Docker adds (and what it costs)

Docker adds a product layer on top of primitives. That product layer is genuinely useful.

**Image registry.** Docker Hub stores images as layers. You pull an image, Docker downloads only what you do not have. This is a content delivery system. It is not a container feature.

**Networking.** Docker creates a bridge network by default. Containers talk to each other by name. Docker handles DNS, routing, and port mapping. This is a network management tool, not a container feature. It is also a layer that hides iptables rules from you.

**Volumes.** Docker manages persistent storage. You mount a host directory or create a named volume. This is a storage tool, not a container feature. It is also a layer that hides UID mapping issues until they surprise you in production.

**Compose.** Docker Compose defines multiple services in one file. This is a workflow tool, not a container feature. It is also a layer that makes it easy to forget which port is which.

**The daemon.** Docker runs a daemon (dockerd) that manages container lifecycle. Underneath, it uses containerd, which uses runc, which actually calls the Linux primitives. There are three layers between you and the kernel.

```
You -> Docker CLI -> dockerd -> containerd -> runc -> kernel (namespaces, cgroups, rootfs)
```

When everything works, you do not notice the layers. When something breaks, you debug through all of them.

## When the product layer breaks

Here is what I have actually debugged in production.

**Docker networking hides iptables rules.** A container could not reach an external API. Docker's bridge network was routing traffic through its own virtual interface. The fix was adding an iptables rule to allow traffic on the host's physical interface. I would have seen this immediately with `iptables -L`. Docker's networking layer made me look at `docker network inspect` instead, which showed nothing wrong.

**Docker volume permissions vs Linux permissions.** A container wrote files to a mounted volume. The host user could not read them. Docker created the files as root inside the container. The host saw a UID that did not match any local user. The fix was `chown` on the host. Docker's volume abstraction made me think the problem was inside the container.

**Docker Desktop resource limits vs cgroups.** A container ran out of memory on macOS but worked fine on Linux. Docker Desktop on macOS runs Linux in a VM. The cgroup limits were set on the VM, not the container. Docker's GUI showed the container had enough memory. The VM did not.

In every case, the debugging path was the same: product layer first, primitives second, fix third. Docker was not wrong. It was abstracting something I needed to see.

## When to reach past Docker

I still use Docker. I use it every day. But I reach past it when:

**I need to see what is happening.** `docker exec` gets me into a container, but `nsenter` gets me into a container's namespaces from the host. When I need to see what the container sees without being inside it, I use Linux tools directly.

**I need to control networking.** Docker's bridge network is fine for most things. When I need to debug a network issue, I use `ip route`, `iptables`, and `ss` directly. Docker's networking is a convenience layer. When it misleads, I go to the substrate.

**I need to understand performance.** Docker adds overhead. The daemon, the network bridge, the overlay filesystem. For performance-critical work, I sometimes run processes directly on the host with cgroups and namespaces configured manually. The overhead is small but real.

**I need to debug a failed build.** Docker build caching is powerful. When it lies (cache invalidation issues, layer ordering problems), I run the build steps manually to see what actually happens at each layer.

The substrate is not hard. Docker makes it feel hard because the product does such a good job of hiding it. When the product fails, the primitives are right there.

## The abstraction is not the problem

I am not saying Docker is bad. I am saying Docker is a product. Products are designed to hide complexity. That is their value. When the complexity matters, you need to see past the product.

The same pattern shows up everywhere. Git is not GitHub. React is not the DOM. Kubernetes is not Linux. The abstraction layer is useful until it is not, and you cannot predict when that will happen.

Understanding primitives is not about abandoning products. It is about knowing where the product ends and the substrate begins. When Docker breaks, you are debugging a layer you cannot see. When containers break, you are debugging primitives you can reason about.

That is the difference.
