import React from "react";
import { SearchButton } from "./SearchButton";

const BaseForm = ({ formData, onInputChange, onSubmit, fields }) => {
    const renderField = (field) => {
        switch (field.type) {
            case "text":
            case "number":
                return (
                    <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        {...field.validation}
                    />
                );
            case "textarea":
                return (
                    <textarea
                        name={field.name}
                        value={formData[field.name]}
                        placeholder={field.placeholder}
                        style={{ height: "200px", padding: "1rem" }}
                        {...field.validation}
                    />
                );
            case "dateRange":
                return (
                    <>
                        <input
                            type="date"
                            name="dateStart"
                            id="date-start"
                            value={formData.dateStart}
                        />
                        <span> - </span>
                        <input
                            type="date"
                            name="dateEnd"
                            id="date-end"
                            value={formData.dateEnd}
                        />
                    </>
                );
            case "select":
                return (
                    <select
                        name={field.name}
                        required={field.required}
                        value={formData.period}
                    >
                        {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            default:
                return null;
        }
    };

    return (
        <form
            className="border-comic"
            onChange={onInputChange}
            onSubmit={onSubmit}
        >
            {fields.map((field) => (
                <div key={field.name}>
                    <p>{field.label}</p>
                    <div className="row-container">{renderField(field)}</div>
                </div>
            ))}
            <SearchButton />
        </form>
    );
};

export default BaseForm;
