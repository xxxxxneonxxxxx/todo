export interface createInterface {
    status: string;
    title: string;
    description: string;
}

export interface GetTasksInterface {
    sort?: string;
    "pagination[page]"?: number;
    "pagination[pageSize]"?: number;
    "pagination[start]"?: number;
    "pagination[limit]"?: number;
    "filters[status][$eq]"?: string;
    fields?: string[];
    populate?: string;
    filters?: {};
    locale: string;
}

function buildQuery(params: Record<string, any>, prefix = ''): string {
    const query = new URLSearchParams();

    function addToQuery(obj: Record<string, any>, prefix = '') {
        for (const key in obj) {
            const value = obj[key];
            if (value === undefined || value === null) continue;

            const paramKey = prefix ? `${prefix}[${key}]` : key;

            if (Array.isArray(value)) {
                value.forEach((val, i) => {
                    query.append(`${paramKey}[${i}]`, val);
                });
            } else if (typeof value === 'object') {
                addToQuery(value, paramKey);
            } else {
                query.append(paramKey, value.toString());
            }
        }
    }

    addToQuery(params, prefix);
    return query.toString();
}

export const Create = (body: createInterface) => {
    return fetch('https://cms.laurence.host/api/tasks', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: body }),
    });
};

export const GetTasks = (params: GetTasksInterface) => {
    const queryString = buildQuery(params);
    const url = `https://cms.laurence.host/api/tasks?${queryString}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });
};
export const DeleteTasks = (id:number) => {
    const url = `https://cms.laurence.host/api/tasks/${id}`;
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
        },
        body: JSON.stringify(id),
    });
};

