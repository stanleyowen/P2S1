// @ts-nocheck
import { useEffect, useState } from "react";
import rekap from "./Rekap Final Data P2S1.json";

const SearchBar = () => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<any>([]);

  const Query = (e) => {
    e.preventDefault();
    if (search === "") {
      setResults([]);
      return;
    }
    const result = rekap.filter((item: any) => {
      return (
        item.NAME.toLowerCase().includes(search.toLowerCase()) ||
        item["STUDENT ID"]
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.CLASS.toLowerCase().includes(search.toLowerCase())
      );
    });
    setResults(result);
    console.log(result);
  };

  return (
    <>
      <h1 className="searchbar-title">Search for participant</h1>
      <form className="searchbar">
        <input
          type="text"
          placeholder="Name or student id or class"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={(e) => Query(e)}>Search</button>
      </form>
      <table className="searchbar-table">
        {results.length === 0 ? (
          <></>
        ) : (
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Competition</th>
              <th>Status</th>
            </tr>
          </thead>
        )}
        <tbody>
          {results.map((item: any, idx: number) => {
            return (
              <tr key={item.CLASS + idx}>
                <td>{item["STUDENT ID"]}</td>
                <td>{item.NAME}</td>
                <td>{item.CLASS}</td>
                <td key={item}>{item["COMPETITION"]}</td>
                <td key={item}>{item["STATUS"]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default SearchBar;
