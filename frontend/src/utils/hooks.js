import { useState } from "react";

export const useCheckboxes = () => {
    const [checkboxes, setCheckboxes] = useState([]);

    const handleCheck = (event) => {
        const { value, checked } = event.target;
        setCheckboxes((prevState) => ({
            ...prevState,
            [value]: checked,
        }));
    };

    const handleCheckAll = () => {
        setCheckboxes(
            Object.keys(checkboxes).reduce(
                (o, key) => ({ ...o, [key]: true }),
                {}
            )
        );
    };

    const handleUncheckAll = () => {
        setCheckboxes(
            Object.keys(checkboxes).reduce(
                (o, key) => ({ ...o, [key]: false }),
                {}
            )
        );
    };

    return {
        checkboxes,
        setCheckboxes,
        handleCheck,
        handleCheckAll,
        handleUncheckAll,
    };
};

export const useForm = (initData) => {
    const [formData, setFormData] = useState(initData);
    const handleInputChange = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };
    return [formData, setFormData, handleInputChange];
};

export const useFetchTracks = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tracks, setTracks] = useState([]);

    const fetchData = async (
        apiCall,
        body,
        transform = (data) => data?.tracks
    ) => {
        setError(null);
        setLoading(true);

        return apiCall(body)
            .then((fetchedTracks) => {
                const normalizedTracks = transform(fetchedTracks);
                console.log("normalized tracks:", normalizedTracks);
                setTracks(normalizedTracks);
                setLoading(false);
                return normalizedTracks;
            })
            .catch((error) => {
                setError(error);
                setTracks([]);
                throw error;
            });
    };
    return { loading, error, setError, tracks, fetchData };
};
