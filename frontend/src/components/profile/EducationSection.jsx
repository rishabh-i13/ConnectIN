import { School, X } from "lucide-react";
import { useState } from "react";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [educations, setEducations] = useState(userData.education || []);
  const [newEducation, setNewEducation] = useState({
    school: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEduId, setSelectedEduId] = useState(null);

  const handleAddEducation = () => {
    if (
      newEducation.school &&
      newEducation.fieldOfStudy &&
      newEducation.startYear
    ) {
      setEducations([...educations, newEducation]);
      setNewEducation({
        school: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
      });
    }
  };

  const handleDeleteEducation = (id) => {
    setEducations(educations.filter((edu) => edu._id !== id));
  };

  const handleSave = () => {
    onSave({ education: educations });
    setIsEditing(false);
  };

  const confirmDelete = (id) => {
    setIsModalOpen(true);
    setSelectedEduId(id);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setSelectedEduId(null);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-black">Education</h2>
      {educations.map((edu) => (
        <div key={edu._id} className="mb-4 flex justify-between items-start">
          <div className="flex items-start">
            <School size={20} className="mr-2 mt-1 text-[#360072]" />
            <div>
              <h3 className="font-semibold text-black">{edu.fieldOfStudy}</h3>
              <p className="text-[#360072]">{edu.school}</p>
              <p className="text-[#360072] text-sm">
                {edu.startYear} - {edu.endYear || "Present"}
              </p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => confirmDelete(edu._id)}
              className="text-[#8E00F4]"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ))}
      {isEditing && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="School"
            value={newEducation.school}
            onChange={(e) =>
              setNewEducation({ ...newEducation, school: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 bg-white text-black border-[#360072]"
          />
          <input
            type="text"
            placeholder="Field of Study"
            value={newEducation.fieldOfStudy}
            onChange={(e) =>
              setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 bg-white text-black border-[#360072]"
          />
          <input
            type="number"
            placeholder="Start Year"
            value={newEducation.startYear}
            onChange={(e) =>
              setNewEducation({ ...newEducation, startYear: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 bg-white text-black border-[#360072]"
          />
          <input
            type="number"
            placeholder="End Year"
            value={newEducation.endYear}
            onChange={(e) =>
              setNewEducation({ ...newEducation, endYear: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 bg-white text-black border-[#360072]"
          />
          <button
            onClick={handleAddEducation}
            className="bg-[#360072] text-white py-2 px-4 rounded hover:bg-[#8E00F4] transition duration-300"
          >
            Add Education
          </button>
        </div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="mt-4 bg-[#360072] text-white py-2 px-4 rounded hover:bg-[#8E00F4] transition duration-300"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 text-[#8E00F4] hover:text-[#360072] transition duration-300"
            >
              Edit Education
            </button>
          )}
        </>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure you want to delete this education?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-400 transition-colors"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-[#360072] to-[#8E00F4] text-white rounded-lg px-4 py-2 hover:from-[#8E00F4] hover:to-[#360072] transition-colors"
                onClick={() => {
                  handleDeleteEducation(selectedEduId);
                  setIsModalOpen(false);
                  setSelectedEduId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EducationSection;
