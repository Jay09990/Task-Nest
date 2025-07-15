import { useState,useEffect } from "react";
import axios from "axios";
import { useApp } from "../context/AppContext";
import {
  X,
  Folder,
  Palette,
  Target,
  Calendar,
  User,
  FileText,
} from "lucide-react";

const CreateProject = ({ project, onSave, isOpen, onClose, onSubmit }) => {
  const { actions } = useApp();
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [status, setStatus] = useState(project?.status || "planning");
  const [color, setColor] = useState(project?.color || "#3B82F6");

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
      setStatus(project.status || "planning");
      setColor(project.color || "#3B82F6");
    }
  }, [project]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    icon: "folder",
    category: "work",
    startDate: "",
    endDate: "",
    teamMembers: [],
    isPrivate: false,
    priority: "medium",
    goals: [],
  });

  const [newTeamMember, setNewTeamMember] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = [
    { name: "Blue", value: "#3B82F6", bg: "bg-blue-500" },
    { name: "Green", value: "#10B981", bg: "bg-green-500" },
    { name: "Purple", value: "#8B5CF6", bg: "bg-purple-500" },
    { name: "Red", value: "#EF4444", bg: "bg-red-500" },
    { name: "Orange", value: "#F59E0B", bg: "bg-orange-500" },
    { name: "Pink", value: "#EC4899", bg: "bg-pink-500" },
    { name: "Indigo", value: "#6366F1", bg: "bg-indigo-500" },
    { name: "Teal", value: "#14B8A6", bg: "bg-teal-500" },
  ];

  const icons = [
    { name: "folder", icon: Folder },
    { name: "target", icon: Target },
    { name: "calendar", icon: Calendar },
    { name: "user", icon: User },
    { name: "file", icon: FileText },
  ];

  const categories = [
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "learning", label: "Learning" },
    { value: "health", label: "Health & Fitness" },
    { value: "creative", label: "Creative" },
    { value: "finance", label: "Finance" },
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // update if your token storage differs

      const res = await axios.post("/api/projects", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        alert("Project created successfully!");
        resetForm();
        onClose();

        e.preventDefault();
        onSave({
          name,
          description,
          status,
          color,
        });
      }
    } catch (error) {
      console.error("Project creation error:", error);
      alert(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
    await actions.createProject(data);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
      icon: "folder",
      category: "work",
      startDate: "",
      endDate: "",
      teamMembers: [],
      isPrivate: false,
      priority: "medium",
      goals: [],
    });
    setNewTeamMember("");
    setNewGoal("");
  };

  const handleAddTeamMember = () => {
    if (
      newTeamMember.trim() &&
      !formData.teamMembers.includes(newTeamMember.trim())
    ) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, newTeamMember.trim()],
      });
      setNewTeamMember("");
    }
  };
  const handleRemoveTeamMember = (memberToRemove) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter(
        (member) => member !== memberToRemove
      ),
    });
  };

  const handleAddGoal = () => {
    if (newGoal.trim() && !formData.goals.includes(newGoal.trim())) {
      setFormData({
        ...formData,
        goals: [...formData.goals, newGoal.trim()],
      });
      setNewGoal("");
    }
  };

  const handleRemoveGoal = (goalToRemove) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((goal) => goal !== goalToRemove),
    });
  };

  const handleKeyPress = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "teamMember") {
        handleAddTeamMember();
      } else if (type === "goal") {
        handleAddGoal();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe your project..."
            />
          </div>

          {/* Color and Icon */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, color: color.value })
                    }
                    className={`w-8 h-8 rounded-full ${color.bg} ${
                      formData.color === color.value
                        ? "ring-2 ring-gray-400 ring-offset-2"
                        : ""
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {icons.map((iconItem) => {
                  const IconComponent = iconItem.icon;
                  return (
                    <button
                      key={iconItem.name}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, icon: iconItem.name })
                      }
                      className={`p-2 rounded-lg border ${
                        formData.icon === iconItem.name
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <IconComponent
                        size={18}
                        style={{ color: formData.color }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.teamMembers.map((member, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{member}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(member)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTeamMember}
                onChange={(e) => setNewTeamMember(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "teamMember")}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add team member..."
              />
              <button
                type="button"
                onClick={handleAddTeamMember}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Goals
            </label>
            <div className="space-y-2 mb-2">
              {formData.goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <span className="text-sm">{goal}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(goal)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "goal")}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add project goal..."
              />
              <button
                type="button"
                onClick={handleAddGoal}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="private"
              checked={formData.isPrivate}
              onChange={(e) =>
                setFormData({ ...formData, isPrivate: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="private"
              className="text-sm font-medium text-gray-700"
            >
              Make this project private
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
