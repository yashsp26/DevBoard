import prisma from "../config/prisma.js";

export const search = async ({ userId, query, type = "all" }) => {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return {
      results: [],
      counts: {
        projects: 0,
        tasks: 0,
        notes: 0,
        snippets: 0,
        labels: 0,
      },
    };
  }

  const contains = {
    contains: searchTerm,
    mode: "insensitive",
  };

  const queries = [];

  if (type === "all" || type === "projects") {
    queries.push(
      prisma.project.findMany({
        where: {
          ownerId: userId,
          OR: [{ name: contains }, { description: contains }],
        },
        select: {
          id: true,
          name: true,
          description: true,
          color: true,
          status: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      }),
    );
  } else {
    queries.push(Promise.resolve([]));
  }

  if (type === "all" || type === "tasks") {
    queries.push(
      prisma.task.findMany({
        where: {
          project: {
            ownerId: userId,
          },
          OR: [{ title: contains }, { description: contains }],
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          updatedAt: true,
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      }),
    );
  } else {
    queries.push(Promise.resolve([]));
  }

  if (type === "all" || type === "notes") {
    queries.push(
      prisma.note.findMany({
        where: {
          userId,
          OR: [{ title: contains }, { content: contains }],
        },
        select: {
          id: true,
          title: true,
          content: true,
          updatedAt: true,
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      }),
    );
  } else {
    queries.push(Promise.resolve([]));
  }

  if (type === "all" || type === "snippets") {
    queries.push(
      prisma.snippet.findMany({
        where: {
          userId,
          OR: [
            { title: contains },
            { description: contains },
            { code: contains },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          language: true,
          updatedAt: true,
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      }),
    );
  } else {
    queries.push(Promise.resolve([]));
  }

  if (type === "all" || type === "labels") {
    queries.push(
      prisma.label.findMany({
        where: {
          project: {
            ownerId: userId,
          },
          name: contains,
        },
        select: {
          id: true,
          name: true,
          color: true,
          createdAt: true,
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
        take: 10,
      }),
    );
  } else {
    queries.push(Promise.resolve([]));
  }

  const [projects, tasks, notes, snippets, labels] = await Promise.all(queries);

  const results = [
    ...projects.map((item) => ({
      ...item,
      type: "project",
    })),

    ...tasks.map((item) => ({
      ...item,
      type: "task",
    })),

    ...notes.map((item) => ({
      ...item,
      type: "note",
    })),

    ...snippets.map((item) => ({
      ...item,
      type: "snippet",
    })),

    ...labels.map((item) => ({
      ...item,
      type: "label",
    })),
  ].sort(
    (a, b) =>
      new Date(b.updatedAt ?? b.createdAt).getTime() -
      new Date(a.updatedAt ?? a.createdAt).getTime(),
  );

  return {
    results,
    counts: {
      projects: projects.length,
      tasks: tasks.length,
      notes: notes.length,
      snippets: snippets.length,
      labels: labels.length,
    },
  };
};
