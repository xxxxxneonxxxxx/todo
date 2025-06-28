import React from "react";
import {Button, Input, Modal} from "antd";
import {createInterface,Create} from "../api";
import {Errors} from "../Config";
import styled from "styled-components";

const { TextArea } = Input;

const AddDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const CreateModal =styled.div`
    display: flex;
    flex-direction: column;
`
const StyledInput = styled(Input)`
  border: 1px solid gray;
`;
const StyledButton = styled(Button)`
  border: 1px solid gray;
`;

export default function Add() {
    const [valueDescription, setValueDescription] = React.useState<string>("");
    const [valueTitle, setValueTitle] = React.useState<string>("");
    const [confirm, setConfirm] = React.useState<string>('');
    const [error, setError] = React.useState<Errors>({
        ErrorCreate: ""
    });
    const [isModalOpenCreate, setIsModalOpenCreate] = React.useState(false);

    async function createTasks() {
        try {
            const body:createInterface =
                {
                status: "notActive",
                title:  valueTitle,
                "description": valueDescription,
            }
            const response= await Create(body)
            if (response.status === 200) {
                setConfirm('You have set the task')
                setValueDescription("");
                setValueTitle("");
            }
        }catch(err){setError({ ErrorCreate: 'an error occurred, try again'})}
    }

    return (
        <AddDiv>
            <Button onClick={() => setIsModalOpenCreate(true)}>Input Task</Button>
            <Modal
                title="Create Task"
                open={isModalOpenCreate}
                onCancel={() => setIsModalOpenCreate(false)}
                footer={null}
            >
                <CreateModal>
                    <StyledInput
                        value={valueTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setValueTitle(e.target.value)
                        }
                    />
                    <TextArea
                        value={valueDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setValueDescription(e.target.value)
                        }
                    />
                    <StyledButton onClick={()=>createTasks()} style={{ marginTop: "10px" }}>
                        Add
                    </StyledButton>
                    <label>{confirm!==''?confirm:(error.ErrorCreate!==''?error.ErrorCreate:"")}</label>
                </CreateModal>
            </Modal>
        </AddDiv>
    );
}
