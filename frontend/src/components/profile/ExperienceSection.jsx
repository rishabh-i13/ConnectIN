import { Briefcase, X, CalendarDays } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../../utils/dateUtils";

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState(userData.experience || []);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpId, setSelectedExpId] = useState(null);

  const handleAddExperience = () => {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.startDate
    ) {
      setExperiences([...experiences, newExperience]);
      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      });
    }
  };

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp._id !== id));
  };

  const handleSave = () => {
    onSave({ experience: experiences });
    setIsEditing(false);
  };

  const handleCurrentlyWorkingChange = (e) => {
    setNewExperience({
      ...newExperience,
      currentlyWorking: e.target.checked,
      endDate: e.target.checked ? "" : newExperience.endDate,
    });
  };

  const openDeleteModal = (id) => {
    setSelectedExpId(id);
    setIsModalOpen(true);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setSelectedExpId(null);
  };

  const confirmDelete = () => {
    if (selectedExpId) {
      handleDeleteExperience(selectedExpId);
      setIsModalOpen(false);
      setSelectedExpId(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-black">Experience</h2>
      {experiences.map((exp) => (
        <div key={exp._id} className="mb-4 flex justify-between items-start">
          <div className="flex items-start">
            <Briefcase size={20} className="mr-2 mt-1 text-[#360072]" />
            <div>
              <h3 className="font-semibold text-black">{exp.title}</h3>
              <p className="text-[#360072]">{exp.company}</p>
              <p className="text-[#360072] text-sm">
                {formatDate(exp.startDate)} -{" "}
                {exp.endDate ? formatDate(exp.endDate) : "Present"}
              </p>
              <p className="text-[#360072]">{exp.description}</p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => openDeleteModal(exp._id)}
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
            placeholder="Title"
            value={newExperience.title}
            onChange={(e) =>
              setNewExperience({ ...newExperience, title: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 bg-white text-black border-[#360072]"
          />
          <input
            type="text"
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 bg-white text-black border-[#360072]"
          />
          <div className="relative mb-2">
            <input
              type="date"
              id="startDate"
              value={newExperience.startDate}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  startDate: e.target.value,
                })
              }
              className="w-full p-2 border rounded bg-white text-black border-[#360072] pr-10"
            />
            <CalendarDays
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#360072] cursor-pointer"
              onClick={() =>
                document.getElementById("startDate")?.showPicker?.()
              }
            />
          </div>

          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={newExperience.currentlyWorking}
              onChange={handleCurrentlyWorkingChange}
              className="mr-2"
            />
            <label htmlFor="currentlyWorking" className="text-black">
              I currently work here
            </label>
          </div>
          {!newExperience.currentlyWorking && (
            <div className="relative mb-2">
              <input
                type="date"
                id="endDate"
                value={newExperience.endDate}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    endDate: e.target.value,
                  })
                }
                className="w-full p-2 border rounded bg-white text-black border-[#360072] pr-10"
              />
              <CalendarDays
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#360072] cursor-pointer"
                onClick={() =>
                  document.getElementById("endDate")?.showPicker?.()
                }
              />
            </div>
          )}
          <textarea
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
            className="w-full p-2 border rounded mb-2 bg-white text-black border-[#360072]"
          />
          <button
            onClick={handleAddExperience}
            className="bg-[#360072] text-white py-2 px-4 rounded hover:bg-[#8E00F4] transition duration-300"
          >
            Add Experience
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
              Edit Experiences
            </button>
          )}
        </>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure you want to delete this experience?
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
                onClick={confirmDelete}
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
export default ExperienceSection;
