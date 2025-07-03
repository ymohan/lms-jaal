import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Lightbulb, BookOpen, Users, Gamepad2 } from 'lucide-react';

interface Methodology {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: 'traditional' | 'modern' | 'interactive' | 'collaborative';
  isCustom?: boolean;
}

interface MethodologyManagerProps {
  methodologies: Methodology[];
  onMethodologiesChange: (methodologies: Methodology[]) => void;
  selectedMethodologies: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function MethodologyManager({ 
  methodologies, 
  onMethodologiesChange, 
  selectedMethodologies, 
  onSelectionChange 
}: MethodologyManagerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMethodology, setNewMethodology] = useState({
    label: '',
    description: '',
    icon: '📚',
    category: 'modern' as const,
  });

  const categoryIcons = {
    traditional: BookOpen,
    modern: Lightbulb,
    interactive: Gamepad2,
    collaborative: Users,
  };

  const categoryColors = {
    traditional: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    modern: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    interactive: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    collaborative: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  };

  const availableIcons = ['📚', '🎯', '🎮', '🎤', '🎨', '🌍', '💬', '🤸‍♂️', '🎧', '📖', '🤖', '👥'];

  const handleAddMethodology = () => {
    if (!newMethodology.label.trim() || !newMethodology.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const methodology: Methodology = {
      id: `custom-${Date.now()}`,
      ...newMethodology,
      isCustom: true,
    };

    onMethodologiesChange([...methodologies, methodology]);
    setNewMethodology({
      label: '',
      description: '',
      icon: '📚',
      category: 'modern',
    });
    setIsAddingNew(false);
  };

  const handleEditMethodology = (id: string, updates: Partial<Methodology>) => {
    const updatedMethodologies = methodologies.map(m =>
      m.id === id ? { ...m, ...updates } : m
    );
    onMethodologiesChange(updatedMethodologies);
    setEditingId(null);
  };

  const handleDeleteMethodology = (id: string) => {
    if (window.confirm('Are you sure you want to delete this methodology?')) {
      const updatedMethodologies = methodologies.filter(m => m.id !== id);
      onMethodologiesChange(updatedMethodologies);
      
      // Remove from selection if selected
      if (selectedMethodologies.includes(id)) {
        onSelectionChange(selectedMethodologies.filter(s => s !== id));
      }
    }
  };

  const handleSelectionToggle = (methodologyId: string) => {
    const newSelection = selectedMethodologies.includes(methodologyId)
      ? selectedMethodologies.filter(id => id !== methodologyId)
      : [...selectedMethodologies, methodologyId];
    onSelectionChange(newSelection);
  };

  const groupedMethodologies = methodologies.reduce((acc, methodology) => {
    if (!acc[methodology.category]) {
      acc[methodology.category] = [];
    }
    acc[methodology.category].push(methodology);
    return acc;
  }, {} as Record<string, Methodology[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Methodologies</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select methodologies for your course and manage custom ones
          </p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom</span>
        </button>
      </div>

      {/* Add New Methodology Form */}
      {isAddingNew && (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-4">Add Custom Methodology</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Name
              </label>
              <input
                type="text"
                value={newMethodology.label}
                onChange={(e) => setNewMethodology(prev => ({ ...prev, label: e.target.value }))}
                className="w-full p-3 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                placeholder="e.g., Kinesthetic Learning"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Category
              </label>
              <select
                value={newMethodology.category}
                onChange={(e) => setNewMethodology(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full p-3 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              >
                <option value="traditional">Traditional</option>
                <option value="modern">Modern</option>
                <option value="interactive">Interactive</option>
                <option value="collaborative">Collaborative</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Description
              </label>
              <textarea
                value={newMethodology.description}
                onChange={(e) => setNewMethodology(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                placeholder="Describe how this methodology works..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {availableIcons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewMethodology(prev => ({ ...prev, icon }))}
                    className={`p-2 text-xl border rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors ${
                      newMethodology.icon === icon 
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-800' 
                        : 'border-blue-300 dark:border-blue-600'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMethodology}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Add Methodology</span>
            </button>
          </div>
        </div>
      )}

      {/* Methodology Categories */}
      <div className="space-y-6">
        {Object.entries(groupedMethodologies).map(([category, categoryMethodologies]) => {
          const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center space-x-2">
                <CategoryIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h4 className="text-md font-medium text-gray-900 dark:text-white capitalize">
                  {category} Methodologies
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[category as keyof typeof categoryColors]}`}>
                  {categoryMethodologies.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryMethodologies.map(methodology => (
                  <div
                    key={methodology.id}
                    className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
                      selectedMethodologies.includes(methodology.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {editingId === methodology.id ? (
                      <EditMethodologyForm
                        methodology={methodology}
                        onSave={(updates) => handleEditMethodology(methodology.id, updates)}
                        onCancel={() => setEditingId(null)}
                        availableIcons={availableIcons}
                      />
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedMethodologies.includes(methodology.id)}
                              onChange={() => handleSelectionToggle(methodology.id)}
                              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{methodology.icon}</span>
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {methodology.label}
                              </h5>
                            </div>
                          </div>
                          
                          {methodology.isCustom && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => setEditingId(methodology.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMethodology(methodology.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {methodology.description}
                        </p>
                        
                        {methodology.isCustom && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              Custom
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedMethodologies.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <h4 className="text-green-900 dark:text-green-100 font-medium mb-2">
            Selected Methodologies ({selectedMethodologies.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedMethodologies.map(id => {
              const methodology = methodologies.find(m => m.id === id);
              return methodology ? (
                <span
                  key={id}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-sm"
                >
                  <span>{methodology.icon}</span>
                  <span>{methodology.label}</span>
                  <button
                    onClick={() => handleSelectionToggle(id)}
                    className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface EditMethodologyFormProps {
  methodology: Methodology;
  onSave: (updates: Partial<Methodology>) => void;
  onCancel: () => void;
  availableIcons: string[];
}

function EditMethodologyForm({ methodology, onSave, onCancel, availableIcons }: EditMethodologyFormProps) {
  const [formData, setFormData] = useState({
    label: methodology.label,
    description: methodology.description,
    icon: methodology.icon,
    category: methodology.category,
  });

  const handleSave = () => {
    if (!formData.label.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={formData.label}
        onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
        placeholder="Methodology name"
      />
      
      <textarea
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        rows={2}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
        placeholder="Description"
      />
      
      <div className="grid grid-cols-6 gap-1">
        {availableIcons.slice(0, 6).map(icon => (
          <button
            key={icon}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, icon }))}
            className={`p-1 text-lg border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              formData.icon === icon 
                ? 'border-blue-500 bg-blue-100 dark:bg-blue-800' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {icon}
          </button>
        ))}
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}