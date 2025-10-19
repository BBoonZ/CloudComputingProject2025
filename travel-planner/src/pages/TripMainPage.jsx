import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import styles from "../css/tripMain.module.css";
import nav from "../css/main-nav.module.css";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { tripService } from '../services/tripService';
import SearchBar from '../components/SearchBar';
import SortBar from '../components/SortBar';

export default function TripMainPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Add user from auth context
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [tripdata, setTripData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [filters, setFilters] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const openModal = () => {
    setTripData({
      name: "",
      detail: "",
      range: "",
      budget: "",
      image: null,
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setPreview(null);
    setTripData(null);
  };

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setTripData({ ...tripdata, image: reader.result });
    }
  };

//   const createTrip = async () => {
//     try {
//       const newTripData = {
//         title: tripdata.name,
//         description: tripdata.detail,
//         start_date: tripdata.range.split(' - ')[0],
//         end_date: tripdata.range.split(' - ')[1],
//         total_budget: parseFloat(tripdata.budget),
//         share_status: 'private',
//         user_id: localStorage.getItem('userId')
//       };

//       const response = await tripService.createTrip(newTripData);
//       if (response.status === 'success') {
//         setShowModal(false);
//         setTripData(null);
//         setPreview(null);
//         // Refresh trips list
//         const publicTrips = await tripService.getPublicTrips();
//         setTrips(publicTrips.data);
//       }
//     } catch (error) {
//       console.error('Error creating trip:', error);
//       // Add error handling here
//     }
//   };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }

        const response = await tripService.getPublicTrips();
        if (response.status === 'success') {
          setTrips(response.data);
          setFilteredTrips(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('ไม่สามารถโหลดข้อมูลทริปได้');
        setLoading(false);
      }
    };

    fetchTrips();
  }, [navigate, isAuthenticated]); // Remove email check, use isAuthenticated

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTrips(trips);
      return;
    }

    try {
      const response = await tripService.searchTrips(query);
      if (response.status === 'success') {
        setFilteredTrips(response.data);
      }
    } catch (error) {
      console.error('Error searching trips:', error);
    }
  };

  const handleSort = async (value) => {
    setSortBy(value);
    await fetchTrips(value, sortOrder, filters);
  };

  const handleOrderChange = async (value) => {
    setSortOrder(value);
    await fetchTrips(sortBy, value, filters);
  };

  const handleFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchTrips(sortBy, sortOrder, newFilters);
  };

  const fetchTrips = async (sort = sortBy, order = sortOrder, currentFilters = filters) => {
    try {
      const response = await tripService.getPublicTrips({
        sortBy: sort,
        order,
        ...currentFilters,
        searchQuery
      });
      if (response.status === 'success') {
        setFilteredTrips(response.data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError('ไม่สามารถโหลดข้อมูลทริปได้');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  useEffect(() => {
    const monthsTH = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    flatpickr("#tripRange", {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      locale: "th",
      onClose: function (selectedDates, dateStr, instance) {
        if (selectedDates.length === 2) {
          const start = selectedDates[0];
          const end = selectedDates[1];

          const dayStart = start.getDate();
          const monthStart = monthsTH[start.getMonth()];
          const yearStart = start.getFullYear() + 543;

          const dayEnd = end.getDate();
          const monthEnd = monthsTH[end.getMonth()];
          const yearEnd = end.getFullYear() + 543;

          let displayText = "";
          if (monthStart === monthEnd && yearStart === yearEnd) {
            displayText = `${dayStart} - ${dayEnd} ${monthStart} ${yearStart}`;
          } else {
            displayText = `${dayStart} ${monthStart} ${yearStart} - ${dayEnd} ${monthEnd} ${yearEnd}`;
          }

          instance.input.value = displayText;
        }
      },
    });
  }, [showModal]);

  if (loading)
    return <div className={styles.loading}>กำลังโหลด...</div>;
  if (error)
    return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>ทริปแนะนำ</h1>
        {isAuthenticated && (
          <button 
            className={styles.createButton}
            onClick={() => navigate('/tripPlan')}
          >
            สร้างทริปใหม่
          </button>
        )}
      </header>

      <SearchBar onSearch={handleSearch} />
      <SortBar 
        onSort={handleSort}
        onOrderChange={handleOrderChange}
        onFilter={handleFilter}
        isVisible={isFilterVisible}
        onToggleVisibility={() => setIsFilterVisible(!isFilterVisible)}
      />

      <div className={styles.tripGrid}>
        {filteredTrips.map((trip) => (
          <div 
            key={trip.room_id} 
            className={styles.tripCard}
            style={{
              backgroundImage: `url(${trip.image || 'https://travel-planner-profile-uploads.s3.amazonaws.com/default-trip.jpg'})`
            }}
          >
            <div className={styles.tripContent}>
              <div className={styles.tripHeader}>
                <h2>{trip.title}</h2>
                <span className={styles.dates}>
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </span>
              </div>
              <p className={styles.description}>{trip.description}</p>
              <div className={styles.ownerInfo}>
                <img 
                  src={trip.User?.profile_uri || "https://via.placeholder.com/40"} 
                  alt={trip.User?.name}
                  className={styles.ownerAvatar}
                />
                <span className={styles.ownerName}>
                  {trip.User?.name || trip.User?.username}
                </span>
              </div>
              <div className={styles.tripFooter}>
                <div className={styles.budget}>
                  งบประมาณ: {trip.total_budget?.toLocaleString('th-TH')} บาท
                </div>
                <div className={styles.members}>
                  {trip.Members?.length || 0} สมาชิก
                </div>
              </div>
              <button 
                className={styles.viewButton}
                onClick={() => navigate(`/trip/${trip.room_id}`)}
              >
                ดูรายละเอียด
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
