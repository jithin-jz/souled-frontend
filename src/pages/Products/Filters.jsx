import { Search, Filter, X } from "lucide-react";

const Filters = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  selectedPrices,
  togglePriceFilter,
  selectedCategories,
  toggleCategoryFilter,
  priceRanges,
  categories,
}) => {
  const selectedPriceLabel =
    selectedPrices.length === 1 ? selectedPrices[0].label : null;

  const selectedCategory =
    selectedCategories.length === 1 ? selectedCategories[0] : null;

  return (
    <>
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-slate-800 text-white"
          />
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-800 text-white"
        >
          <Filter className="w-5 h-5 text-slate-300" />
          <span>Filters</span>
        </button>

        {/* Desktop Filters */}
        <div className="hidden md:flex flex-wrap items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
          <span className="text-sm font-medium text-slate-300">Price:</span>
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => togglePriceFilter(range)}
              className={`px-3 py-1 text-sm rounded-full transition ${
                selectedPriceLabel === range.label
                  ? "bg-red-900 text-white border border-red-700"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600"
              }`}
            >
              {range.label}
            </button>
          ))}

          <span className="text-sm font-medium text-slate-300 ml-4">
            Category:
          </span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategoryFilter(category)}
              className={`px-3 py-1 text-sm rounded-full transition ${
                selectedCategory === category
                  ? "bg-red-900 text-white border border-red-700"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="md:hidden bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-200">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-medium text-gray-200">Price Range</h4>
            <div className="space-y-2 mt-2">
              {priceRanges.map((range) => (
                <label
                  key={range.label}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceLabel === range.label}
                    onChange={() => togglePriceFilter(range)}
                    className="h-4 w-4 text-red-600 border-slate-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-slate-300">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <h4 className="text-sm font-medium text-gray-200">Category</h4>
            <div className="space-y-2 mt-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => toggleCategoryFilter(category)}
                    className="h-4 w-4 text-red-600 border-slate-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-slate-300">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Filters;

