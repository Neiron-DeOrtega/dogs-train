import { useState } from "react";
import CreateForm from "./CreateForm";
import SearchForm from "./SearchForm";

const UserCreate = () => {

    return (
        <div className="admin-wrapper">
            <CreateForm />
            <SearchForm />
        </div>
    );
};

export default UserCreate;
