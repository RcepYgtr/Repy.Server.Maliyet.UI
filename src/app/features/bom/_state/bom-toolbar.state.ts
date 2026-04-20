

export interface BomToolbarState {



    onTabActivated?: (tabId: string) => void;

    // 🔹 PAGINATION STATE
    pagination?: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalCount?: number;
    };
    tabActions: {
        new?: () => void;
        save?: () => void;
        edit?: () => void;
        delete?: () => void;
        add_material?: () => void;

    };

    headerActions: {
        new?: () => void;
        edit?: () => void;
        delete?: () => void;
        save?: () => void;
        refresh?: () => void;
        page?: () => void;

        // 🔥 pagination aksiyonları
        firstPage?: () => void;
        prevPage?: () => void;
        nextPage?: () => void;
        lastPage?: () => void;
        goToPage?: (page: number) => void;

        filter?: () => void;
        excel?: () => void;
        print?: () => void;
        showChart?: () => void;
        createImalatFormu?: () => void;
    };





}