import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface CropFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  register: UseFormRegister<any>;
}

const CropForm: React.FC<CropFormProps> = ({ onSubmit, register }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Crop Type:</label>
        <input {...register('cropType')} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-1">Region/Location:</label>
        <input {...register('region')} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-1">Soil Type:</label>
        <select {...register('soilType')} className="w-full p-2 border rounded">
          <option value="sandy">Sandy</option>
          <option value="loamy">Loamy</option>
          <option value="clay">Clay</option>
        </select>
      </div>
      <div>
        <label className="block mb-1">Season:</label>
        <select {...register('season')} className="w-full p-2 border rounded">
          <option value="kharif">Kharif</option>
          <option value="rabi">Rabi</option>
          <option value="zaid">Zaid</option>
        </select>
      </div>
      <div>
        <label className="block mb-1">Seed Variety:</label>
        <input {...register('seedVariety')} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-1">Sowing Date:</label>
        <input type="date" {...register('sowingDate')} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-1">Irrigation Schedule:</label>
        <textarea {...register('irrigationSchedule')} className="w-full p-2 border rounded" rows={3} />
      </div>
      <div>
        <label className="block mb-1">Fertilizer Schedule:</label>
        <textarea {...register('fertilizerSchedule')} className="w-full p-2 border rounded" rows={3} />
      </div>
      <div>
        <label className="block mb-1">Pesticide/Herbicide Plan:</label>
        <textarea {...register('pesticideHerbicidePlan')} className="w-full p-2 border rounded" rows={3} />
      </div>
      <div>
        <label className="block mb-1">Expected Harvest Date:</label>
        <input type="date" {...register('expectedHarvestDate')} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-1">Yield Goals:</label>
        <input {...register('yieldGoals')} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-1">Weather Forecast:</label>
        <textarea {...register('weatherForecast')} className="w-full p-2 border rounded" rows={3} />
      </div>
      <div>
        <label className="block mb-1">Growth Stages Timeline:</label>
        <textarea {...register('growthStagesTimeline')} className="w-full p-2 border rounded" rows={3} />
      </div>
      <div>
        <label className="block mb-1">Market Price Forecast (optional):</label>
        <input {...register('marketPriceForecast')} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-1">Field Management Notes (optional):</label>
        <textarea {...register('fieldManagementNotes')} className="w-full p-2 border rounded" rows={3} />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Generate Roadmap
      </button>
    </form>
  );
};

export default CropForm;
