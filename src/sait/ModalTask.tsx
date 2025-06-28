import React from "react";
import {Modal} from "antd";

interface TaskItem {
    id: number;
    attributes: {
        title: string;
    };
}

interface ModalTaskProps {
    task: TaskItem | null;
    isModalOpenTask: boolean;
    onCloseTask: () => void;
}

export default function ModalTask({ task, isModalOpenTask, onCloseTask }: ModalTaskProps) {
    return (
        <Modal
            title="rrrr"
            open={isModalOpenTask}
            onCancel={onCloseTask}
            footer={null}
        >
            {task ? (
                <div>
                    <p>ID: {task.id}</p>
                    <p>Title: {task.attributes.title}</p>
                </div>
            ) : (
                <p>No task selected</p>
            )}
        </Modal>
    );
}