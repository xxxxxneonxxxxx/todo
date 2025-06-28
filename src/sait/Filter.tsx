import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import {useGlobalFilter} from "../Config";

interface ButtonProps {
    $active: boolean;
}

const FilterDiv = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    border: 1px solid gray;
    border-radius: 10px;
    padding: 10px;
`;

const FilterButton = styled(Button)<ButtonProps>`
    border: none;
    font-size: 16px;
    color: ${({ $active }) => ($active ? "blue" : "black")};
    &:hover {
        background-color: ${({ $active }) => ($active ? "blue" : "#f0f0f0")};
    }
`;

export default function Filter() {
    const filter = useGlobalFilter(state => state.filter);
    const setFilter = useGlobalFilter(state => state.setFilter);

    return (
        <FilterDiv>
            <FilterButton $active={filter === "all"} onClick={() => setFilter("all")}>
                All
            </FilterButton>
            <FilterButton $active={filter === "Active"} onClick={() => setFilter("Active")}>
                Active
            </FilterButton>
            <FilterButton $active={filter === "Completed"} onClick={() => setFilter("Completed")}>
                Completed
            </FilterButton>
        </FilterDiv>
    );
}