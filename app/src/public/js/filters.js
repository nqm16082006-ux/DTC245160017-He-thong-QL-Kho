document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // SẢN PHẨM (PRODUCTS FILTER)
    // =====================================
    const productFilterForm = document.getElementById("productFilterForm");
    const productSearch = document.getElementById("productSearch");
    const productAutoFilters = document.querySelectorAll(".auto-submit-filter");

    if (productFilterForm) {
        // Tự động submit khi đổi dropdown lọc hoặc sắp xếp
        productAutoFilters.forEach((element) => {
            element.addEventListener("change", () => {
                productFilterForm.requestSubmit();
            });
        });

        // Tìm kiếm debounce 500ms
        if (productSearch) {
            let productSearchTimer;

            productSearch.addEventListener("input", () => {
                clearTimeout(productSearchTimer);
                productSearchTimer = setTimeout(() => {
                    productFilterForm.requestSubmit();
                }, 500);
            });

            // Enter submit ngay lập tức
            productSearch.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    clearTimeout(productSearchTimer);
                    productFilterForm.requestSubmit();
                }
            });
        }
    }

    // =====================================
    // NHÀ CUNG CẤP (SUPPLIERS FILTER)
    // =====================================
    const supplierFilterForm = document.getElementById("supplierFilterForm");
    const supplierSearch = document.getElementById("supplierSearch");
    const supplierAutoFilters = document.querySelectorAll(".supplier-auto-filter");

    if (supplierFilterForm) {
        // Tự động submit khi đổi dropdown sắp xếp
        supplierAutoFilters.forEach((element) => {
            element.addEventListener("change", () => {
                supplierFilterForm.requestSubmit();
            });
        });

        // Tìm kiếm debounce 500ms
        if (supplierSearch) {
            let supplierSearchTimer;

            supplierSearch.addEventListener("input", () => {
                clearTimeout(supplierSearchTimer);
                supplierSearchTimer = setTimeout(() => {
                    supplierFilterForm.requestSubmit();
                }, 500);
            });

            // Enter submit ngay lập tức
            supplierSearch.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    clearTimeout(supplierSearchTimer);
                    supplierFilterForm.requestSubmit();
                }
            });
        }
    }

});
