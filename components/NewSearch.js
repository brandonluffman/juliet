import React from 'react'
import { BsArrowUp } from 'react-icons/bs';

const NewSearch = () => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // onSearch(query);
    };
    
    return (
        <form className='searchBar sideSearchBar' onSubmit={handleSubmit}>
        <input
            type="text"
            className='searchInput searchInputSidebar'
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className='searchButton sidebarSearchButton'>
            <BsArrowUp />
        </button>
        </form>
  )
}

export default NewSearch