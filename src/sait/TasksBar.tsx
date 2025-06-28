import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { GetTasks, GetTasksInterface, DeleteTasks } from "../api";
import { useGlobalFilter } from "../Config";
import ModalTask from "./ModalTask";

interface TaskItem {
    id: number;
    attributes: {
        title: string;
        status: string;
    };
}

const TasksBarStyled = styled.div`
    margin-bottom: 20px;
    border: 1px solid gray;
    overflow-y: auto;
    border-radius: 10px;
`;

const TaskContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 10px;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid gray;
    border-radius: 10px;
`;

const TaskButton = styled.button`
    display: flex;
    border: none;
    background: none;
    margin-left: 10px;
    font-size: 16px;
    flex-grow: 1;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
`;

const StyledButton = styled.button`
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const CheckboxInput = styled.input`
    margin-right: 10px;
    width: 20px;
    height: 20px;
`;

const ScrollableContainer = styled.div`
    max-height: 400px;
    overflow-y: scroll;
    margin-bottom: 10px;
`;

export default function TasksBar() {
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
    const [isModalOpenTask, setIsModalOpenTask] = useState(false);
    const filter = useGlobalFilter((state) => state.filter);
    const setFilter = useGlobalFilter((state) => state.setFilter);
    const [checkboxState, setCheckboxState] = useState<Record<number, boolean>>({});

    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [PopularTasks, setPopularTasks] = useState<TaskItem[]>(() => {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : [];
    });

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const fetchTasks = async (page: number) => {
        setLoading(true);
        console.log("Загрузка задач...");
        try {
            let filterQuery = {};
            if (filter === "Active") {
                filterQuery = { status: { $eq: "active" } };
            } else if (filter === "Completed") {
                filterQuery = { status: { $eq: "completed" } };
            }

            const body: GetTasksInterface = {
                sort: "createdAt:desc",
                "pagination[page]": page,
                "pagination[pageSize]": 50,
                fields: ["title", "status"],
                populate: "*",
                locale: "en",
                ...(filter !== "all" && filter !== "Favorites" && { filters: filterQuery }),
            };

            const response = await GetTasks(body);
            if (response.status === 200) {
                const data = await response.json();
                setTasks((prev) => {
                    const existingIds = new Set(prev.map((task) => task.id));
                    const newTasks = data.data.filter((task: TaskItem) => !existingIds.has(task.id));
                    return [...prev, ...newTasks];
                });
            } else {
                console.log("Ошибка при получении задач:", response.status);
            }
        } catch (error) {
            console.error("Ошибка при получении задач:", error);
        } finally {
            setLoading(false);
            console.log("Загрузка задач завершена");
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight * 0.7;
            if (isAtBottom && !loading) {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                const id = setTimeout(() => {
                    setPage((prevPage) => {
                        const newPage = prevPage + 1;
                        fetchTasks(newPage);
                        return newPage;
                    });
                }, 5000);
                setTimeoutId(id);
            }
        }
    };

    const handleCheckboxChange = (taskId: number) => {
        setCheckboxState((prevState) => ({
            ...prevState,
            [taskId]: !prevState[taskId],
        }));
    };

    useEffect(() => {
        console.log("Загрузка задач при изменении фильтра");
        setPage(1);
        fetchTasks(1);
    }, [filter]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.addEventListener("scroll", handleScroll);
            return () => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.removeEventListener("scroll", handleScroll);
                }
            };
        }
    }, []);

    const ClickFovoritGet = (task: TaskItem) => {
        setPopularTasks((prev) => {
            const exists = prev.some((t) => t.id === task.id);
            if (!exists) {
                return [...prev, task];
            }
            return prev;
        });
    };

    const ClickFovoritDelete = (task: TaskItem) => {
        setPopularTasks((prev) => prev.filter((t) => t.id !== task.id));
    };

    const ClickDelete = async (task: TaskItem) => {
        try {
            const response = await DeleteTasks(task.id);
            if (response.status === 200) {
                setPopularTasks((prev) => prev.filter((t) => t.id !== task.id));
                const currentFilter = filter;
                setFilter("temp");
                setTimeout(() => setFilter(currentFilter), 50);
            }
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
        }
    };

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(PopularTasks));
    }, [PopularTasks]);

    return (
        <>
            <ScrollableContainer ref={scrollContainerRef}>
                <TasksBarStyled>
                    {PopularTasks.map((task) => (
                        <TaskContainer key={task.id}>
                            <CheckboxInput type="checkbox" onChange={() => handleCheckboxChange(task.id)} />
                            <TaskButton
                                onClick={() => {
                                    setSelectedTask(task);
                                    setIsModalOpenTask(true);
                                }}
                            >
                                {task.attributes.title}
                            </TaskButton>
                            <ButtonGroup>
                                <StyledButton onClick={() => ClickFovoritDelete(task)} aria-label="Удалить из избранного">
                                    ⭐
                                </StyledButton>
                                <StyledButton onClick={() => ClickDelete(task)} aria-label="Удалить задачу">
                                    🗑️
                                </StyledButton>
                            </ButtonGroup>
                        </TaskContainer>
                    ))}
                </TasksBarStyled>
            </ScrollableContainer>

            {filter !== "Favorites" && (
                <ScrollableContainer ref={scrollContainerRef}>
                    <TasksBarStyled>
                        {tasks.map((task) => (
                            <TaskContainer key={task.id}>
                                <CheckboxInput type="checkbox" checked={task.attributes.status === "completed"} />
                                <TaskButton
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setIsModalOpenTask(true);
                                    }}
                                >
                                    {task.attributes.title}
                                </TaskButton>
                                <ButtonGroup>
                                    <StyledButton onClick={() => ClickFovoritGet(task)} aria-label="Добавить в избранное">
                                        ⭐
                                    </StyledButton>
                                    <StyledButton onClick={() => ClickDelete(task)} aria-label="Удалить задачу">
                                        🗑️
                                    </StyledButton>
                                </ButtonGroup>
                            </TaskContainer>
                        ))}
                    </TasksBarStyled>
                </ScrollableContainer>
            )}

            <ModalTask task={selectedTask} isModalOpenTask={isModalOpenTask} onCloseTask={() => setIsModalOpenTask(false)} />
        </>
    );
}
