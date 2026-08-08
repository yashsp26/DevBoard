import prisma from "../config/prisma.js";

export const getDashboardData = async (userId) => {
  const [
    projects,
    activeProjects,
    archivedProjects,
    favoriteProjects,
    tasks,
    completedTasks,
    todoTasks,
    inProgressTasks,
    reviewTasks,
    notes,
    snippets,
    labels,
    tasksSummary,
    upcomingTasks,
    recentProjects,
    recentTasks,
    recentNotes,
    recentSnippets,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        ownerId: userId,
      },
    }),

    prisma.project.count({
      where: {
        ownerId: userId,
        status: "ACTIVE",
      },
    }),

    prisma.project.count({
      where: {
        ownerId: userId,
        status: "ARCHIVED",
      },
    }),

    prisma.project.count({
      where: {
        ownerId: userId,
        isFavorite: true,
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: userId,
        },
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: userId,
        },
        status: "DONE",
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: userId,
        },
        status: "TODO",
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: userId,
        },
        status: "IN_PROGRESS",
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: userId,
        },
        status: "REVIEW",
      },
    }),

    prisma.note.count({
      where: {
        userId,
      },
    }),

    prisma.snippet.count({
      where: {
        userId,
      },
    }),

    prisma.label.count({
      where: {
        project: {
          ownerId: userId,
        },
      },
    }),

    prisma.task.groupBy({
      by: ["status"],
      where: {
        project: {
          ownerId: userId,
        },
      },
      _count: {
        _all: true,
      },
    }),

    prisma.task.findMany({
      where: {
        project: {
          ownerId: userId,
        },
        dueDate: {
          not: null,
        },
        status: {
          not: "DONE",
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
      take: 5,
    }),

    prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        color: true,
        status: true,
        isFavorite: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    }),

    prisma.task.findMany({
      where: {
        project: {
          ownerId: userId,
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
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
      take: 5,
    }),

    prisma.note.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        projectId: true,
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
      take: 5,
    }),

    prisma.snippet.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        language: true,
        projectId: true,
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
      take: 5,
    }),
  ]);

  const recentActivity = [
    ...recentProjects.map((project) => ({
      id: `project-${project.id}`,
      type: "project",
      action: "updated",
      title: project.name,
      updatedAt: project.updatedAt,
      project: {
        id: project.id,
        name: project.name,
        color: project.color,
      },
    })),

    ...recentTasks.map((task) => ({
      id: `task-${task.id}`,
      type: "task",
      action: "updated",
      title: task.title,
      updatedAt: task.updatedAt,
      project: task.project,
    })),

    ...recentNotes.map((note) => ({
      id: `note-${note.id}`,
      type: "note",
      action: "updated",
      title: note.title,
      updatedAt: note.updatedAt,
      project: note.project,
    })),

    ...recentSnippets.map((snippet) => ({
      id: `snippet-${snippet.id}`,
      type: "snippet",
      action: "updated",
      title: snippet.title,
      updatedAt: snippet.updatedAt,
      project: snippet.project,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 8);

  return {
    statistics: {
      projects,
      activeProjects,
      archivedProjects,
      favoriteProjects,
      tasks,
      completedTasks,
      todoTasks,
      notes,
      snippets,
      labels,
    },

    tasksSummary: {
      todo: todoTasks,
      inProgress: inProgressTasks,
      review: reviewTasks,
      completed: completedTasks,
      total: tasks,
      byStatus: tasksSummary,
    },

    projectsSummary: {
      total: projects,
      active: activeProjects,
      archived: archivedProjects,
      favorites: favoriteProjects,
    },

    upcomingTasks,

    recentActivity,

    recentNotes,

    recentSnippets,
  };
};
