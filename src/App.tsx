import { create } from 'zustand';
import { persist } from 'zustand/middleware'
import './App.css';


interface IFilterField {
  type: 'multi-select' | 'select' | 'range';
  label: string;
  options?: (string | number)[];
  min?: number;
  max?: number;
}

interface IFilterStoreState {
  filters: IFilterField[];
  filterValues: { [key: string]: any };
  isFormLoaded: boolean;
  renderForm: () => void;
  initializeFilters: (data: IFilterField[]) => void;
  updateFilterValue: (label: string, value: any) => void;
  resetFilters: () => void;
}


const filterMockData: IFilterField[] = [
  { type: 'multi-select', label: 'Корпус', options: [1, 2, 3, 4, '4а', '46'] },
  { type: 'select', label: 'Отделка', options: ['Все', 'Есть', 'Нет'] },
  { type: 'multi-select', label: 'Комнаты', options: ['Студия', 1, 2, 3, 4, '4+'] },
  { type: 'multi-select', label: 'Срок сдачи', options: ['Сдан', 'II кв 2025', 'I кв 2025'] },
  { type: 'range', label: 'Этаж', min: 1, max: 20 },
  { type: 'range', label: 'Площадь, м²', min: 10, max: 100 },
  { type: 'range', label: 'Цена, млн ₽', min: 1, max: 20 },
];


const useFilterStore = create(persist<IFilterStoreState>((set) => ({
  filters: [],
  filterValues: {},
  isFormLoaded: false,

  renderForm: () => set({ isFormLoaded: true }),

  initializeFilters: (data) => set({ filters: data, filterValues: {} }),

  updateFilterValue: (label, value) =>
    set((state) => ({
      filterValues: { ...state.filterValues, [label]: value },
    })),

  resetFilters: () => set({  
    filterValues: {},
  }),
}), {
  name: 'filter-storage',
}));



const DynamicFilter = () => {
  const { filters, filterValues, isFormLoaded, renderForm, initializeFilters, updateFilterValue, resetFilters } = useFilterStore();

  return (
    <div>
      {!isFormLoaded ? (
        <button onClick={() => {
          renderForm();
          initializeFilters(filterMockData);
        }}>
          Загрузить форму
        </button>
      ) : (
        <>
          {filters.map((field) => {
            switch (field.type) {
              case 'multi-select':
                return (
                  <div key={field.label}>
                    <label>{field.label}</label>
                    <div>
                      {field.options?.map((option) => (
                        <button
                          key={option}
                          className={`${filterValues[field.label] && filterValues[field.label].includes(option) ? 'selected' : ''}`}
                          onClick={() => {
                            let options;
                            const currentOptions = filterValues[field.label] && filterValues[field.label].length ? [...filterValues[field.label]] : []; 
                            
                            if (!currentOptions.includes(option)) {
                              options = [...currentOptions, option];
                            } else {
                              options = [...currentOptions].filter((item) => item !== option);
                            }

                            updateFilterValue(field.label, options);
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                );

              case 'select':
                return (
                  <div key={field.label}>
                    <label>{field.label}</label>
                    <div>
                      {field.options?.map((option) => (
                        <button
                          key={option}
                          className={`${filterValues[field.label] === option ? 'selected' : ''}`}
                          onClick={() => updateFilterValue(field.label, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                );

              case 'range':
                return (
                  <div key={field.label}>
                    <label>{field.label}</label>
                    <div>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        value={filterValues[field.label]?.min || field.min}
                        onChange={(e) =>
                          updateFilterValue(field.label, { ...filterValues[field.label], min: Number(e.target.value) })
                        }
                      />
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        value={filterValues[field.label]?.max || field.max}
                        onChange={(e) =>
                          updateFilterValue(field.label, { ...filterValues[field.label], max: Number(e.target.value) })
                        }
                      />
                      <div>
                        {filterValues[field.label]?.min || field.min} - {filterValues[field.label]?.max || field.max}
                      </div>
                    </div>
                  </div>
                );

              default:
                return null;
            }
          })}

          <button onClick={resetFilters}>
            Сбросить фильтры
          </button>

          <div className='filter'>
            {JSON.stringify(filterValues, null, 2)}
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicFilter;
