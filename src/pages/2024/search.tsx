// @ts-nocheck
import { useEffect, useState } from "react";
import rekap from "./Rekap Final Data P2S1.json";
import * as translation from "./Translation.json";

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
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.INDUK.toString().toLowerCase().includes(search.toLowerCase()) ||
        item.kelas.toLowerCase().includes(search.toLowerCase())
      );
    });
    setResults(result);
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
          {results.map((item: any) => {
            return item.perlombaan.map((i: any, idx: string) => {
              return (
                <tr key={item.nama + idx}>
                  <td>{item.INDUK}</td>
                  <td>{item.nama}</td>
                  <td>{item.kelas}</td>
                  <td key={item}>
                    {translation[i["nama perlombaan"]] ?? i["nama perlombaan"]}
                  </td>
                  <td key={item}>{i["keterangan"]}</td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </>
  );
};
export default SearchBar;
