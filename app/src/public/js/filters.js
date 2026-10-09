document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // PRODUCTS
    // =====================================

    const productFilterForm =
        document.getElementById("productFilterForm");

    const productSearch =
        document.getElementById("productSearch");

    const productAutoFilters =
        document.querySelectorAll(
            ".auto-submit-filter"
        );


    if (productFilterForm) {

        productAutoFilters.forEach(
            (element) => {

                element.addEventListener(
                    "change",
                    () => {

                        productFilterForm.requestSubmit();

                    }
                );

            }
        );


        if (productSearch) {

            let productSearchTimer;


            productSearch.addEventListener(
                "input",
                () => {

                    clearTimeout(
                        productSearchTimer
                    );


                    productSearchTimer =
                        setTimeout(
                            () => {

                                productFilterForm.requestSubmit();

                            },
                            500
                        );

                }
            );

        }
    }


    // =====================================
    // SUPPLIERS
    // =====================================

    const supplierFilterForm =
        document.getElementById(
            "supplierFilterForm"
        );

    const supplierSearch =
        document.getElementById(
            "supplierSearch"
        );

    const supplierAutoFilters =
        document.querySelectorAll(
            ".supplier-auto-filter"
        );


    if (supplierFilterForm) {

        supplierAutoFilters.forEach(
            (element) => {

                element.addEventListener(
                    "change",
                    () => {

                        supplierFilterForm.requestSubmit();

                    }
                );

            }
        );


        if (supplierSearch) {

            let supplierSearchTimer;


            supplierSearch.addEventListener(
                "input",
                () => {

                    clearTimeout(
                        supplierSearchTimer
                    );


                    supplierSearchTimer =
                        setTimeout(
                            () => {

                                supplierFilterForm.requestSubmit();

                            },
                            500
                        );

                }
            );

        }
    }

});
