import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialDatasets from '../data/datasets.json';
import initialRequests from '../data/requests.json';
import { searchDatasets as searchUtil } from '../utils/search';
import { calculateFairScore } from '../utils/fairScore';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // Datasets: load from localStorage or fall back to the bundled JSON
  const [datasets, setDatasets] = useState(() => {
    const stored = localStorage.getItem('hdip_datasets');
    return stored ? JSON.parse(stored) : initialDatasets;
  });

  // Access requests: load from localStorage or fall back to the bundled JSON
  const [accessRequests, setAccessRequests] = useState(() => {
    const stored = localStorage.getItem('hdip_requests');
    return stored ? JSON.parse(stored) : initialRequests;
  });

  // Persist datasets to localStorage on change
  useEffect(() => {
    localStorage.setItem('hdip_datasets', JSON.stringify(datasets));
  }, [datasets]);

  // Persist access requests to localStorage on change
  useEffect(() => {
    localStorage.setItem('hdip_requests', JSON.stringify(accessRequests));
  }, [accessRequests]);

  // Bookmarks: load from localStorage or fall back to empty array
  const [bookmarks, setBookmarks] = useState(() => {
    const stored = localStorage.getItem('hdip_bookmarks');
    return stored ? JSON.parse(stored) : [];
  });

  // Persist bookmarks to localStorage on change
  useEffect(() => {
    localStorage.setItem('hdip_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Search / filter datasets using the utility function
  const searchDatasets = useCallback(
    (query = '', filters = {}) => {
      return searchUtil(datasets, query, filters);
    },
    [datasets]
  );

  // Look up a single dataset by id
  const getDataset = useCallback(
    (id) => {
      return datasets.find((ds) => ds.id === id) || null;
    },
    [datasets]
  );

  // Add a new dataset (generates an id and computes FAIR score)
  const addDataset = useCallback((dataset) => {
    const newDataset = {
      ...dataset,
      id: `ds-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: dataset.status || 'draft',
    };
    // Compute FAIR score for the new dataset
    newDataset.fairScore = calculateFairScore(newDataset);

    setDatasets((prev) => [...prev, newDataset]);
    return newDataset;
  }, []);

  // Create a new access request
  const createRequest = useCallback((request) => {
    const newRequest = {
      ...request,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setAccessRequests((prev) => [...prev, newRequest]);
    return newRequest;
  }, []);

  // Toggle a dataset bookmark on/off
  const toggleBookmark = useCallback((datasetId) => {
    setBookmarks((prev) =>
      prev.includes(datasetId)
        ? prev.filter((id) => id !== datasetId)
        : [...prev, datasetId]
    );
  }, []);

  // Check if a dataset is bookmarked
  const isBookmarked = useCallback(
    (datasetId) => bookmarks.includes(datasetId),
    [bookmarks]
  );

  // Update the status of an existing access request
  const updateRequestStatus = useCallback((requestId, newStatus) => {
    setAccessRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: newStatus, updatedAt: new Date().toISOString() }
          : req
      )
    );
  }, []);

  const value = {
    datasets,
    searchDatasets,
    getDataset,
    addDataset,
    accessRequests,
    createRequest,
    updateRequestStatus,
    bookmarks,
    toggleBookmark,
    isBookmarked,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;
