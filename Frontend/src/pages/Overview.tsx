import React, { useEffect, useState } from "react";
import Overview_Cards from "../components/Overview/Overview_Cards/Overview_Cards";
import { API_BASE_URL } from "../constants/apiBase";
import Popup from "../components/Popup/Popup";

interface FacilityAPI {
  deviceId: string;
  deviceName: string;
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  leave?: number;
}

const Overview: React.FC = () => {
  const [facilities, setFacilities] = useState<FacilityAPI[]>([]);
  const [employeeBranchId, setEmployeeBranchId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const homeDataStr = localStorage.getItem("homeData");
      if (!homeDataStr) return;

      const homeData = JSON.parse(homeDataStr);
      const branchId = homeData.userProfile?.BranchId || "";
      setEmployeeBranchId(branchId);

      try {
        const res = await fetch(`${API_BASE_URL}overview`);
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          // Move matched branch to first
          const sortedFacilities = [...result.data].sort((a, b) => {
            if (a.deviceId === branchId) return -1;
            if (b.deviceId === branchId) return 1;
            return 0;
          });

          setFacilities(sortedFacilities);
          setLoading(false); // Only stop loading if fetch succeeds
        }
      } catch (err) {
        // API failed: loading stays true, popup continues
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading && <Popup isOpen={true} type="loading" />}
      {!loading && facilities.length > 0 && (
        <Overview_Cards
          facilities={facilities}
          highlightBranchId={employeeBranchId}
        />
      )}
    </>
  );
};

export default Overview;
