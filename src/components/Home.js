import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from './Loader';

const Home = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(Array.from(Array(data).keys(), n => n + 10));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        fetchMoreListItems()
    }, [isFetching]);

    function fetchMoreListItems() {
        setTimeout(() => {
            setItemsPerPage(data.length + 10)
            setIsFetching(false);
        }, 2000);
    }

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
        setIsFetching(true);
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const results = await axios("https://api.giphy.com/v1/gifs/trending", {
                    params: {
                        api_key: "y5VwsD9f6oSy4g71h4w0bjkZIskKurhe",
                        limit: 100
                    }
                });

                console.log(results);
                setData(results.data.data);
            } catch (err) {
                setIsError(true);
                setTimeout(() => setIsError(false), 4000);
            }

            setIsLoading(false);
        };

        fetchData();
    }, []);

    const renderGifs = () => {
        if (isLoading) {
            return <Loader />;
        }
        return currentItems.map(el => {
            return (
                <div key={el.id} className="gif">
                    <img src={el.images.fixed_height.url} />
                </div>
            );
        });
    };
    const renderError = () => {
        if (isError) {
            return (
                <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                >
                    Unable to get Gifs, please try again in a few minutes
                </div>
            );
        }
    };

    const handleSearchChange = event => {
        setSearch(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsError(false);
        setIsLoading(true);

        try {
            const results = await axios("https://api.giphy.com/v1/gifs/search", {
                params: {
                    api_key: "y5VwsD9f6oSy4g71h4w0bjkZIskKurhe",
                    q: search,
                    limit: 5
                }
            });
            setData(results.data.data);
        } catch (err) {
            setIsError(true);
            setTimeout(() => setIsError(false), 4000);
        }

        setIsLoading(false);
    };

    const pageSelected = pageNumber => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="m-2">
            {renderError()}
            <form className="form-inline justify-content-center m-2">
                <input
                    value={search}
                    onChange={handleSearchChange}
                    type="text"
                    placeholder="search"
                    className="form-control"
                />
                <button
                    onClick={handleSubmit}
                    type="submit"
                    className="btn btn-primary mx-2"
                >
                    Go
                </button>
            </form>
            <div className="container gifs">{renderGifs()}</div>
        </div>
    );
};
export default Home