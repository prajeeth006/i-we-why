export type JobConfig = {
    ciImage: string;
    ciTag: string;
    script: string;
    when: 'on-success' | 'manual';
    parallel: 1 | 2 | 4 | 8 | 16 | 32;
};

export const LOAD_CONFIG: { [key: string]: JobConfig } = {
    'device-atlas-api-load-test': {
        ciImage: 'docker-public.dev.docker.env.works/b2d-grafana-k6',
        ciTag: 'k8s-linux-docker-runner',
        script: 'k6 run backend/vanilla/load-tests/device-atlas-api/load-test.js',
        when: 'manual',
        parallel: 4,
    },
    'device-atlas-api-smoke-test': {
        ciImage: 'docker-public.dev.docker.env.works/b2d-grafana-k6',
        ciTag: 'k8s-linux-docker-runner',
        script: 'k6 run backend/vanilla/load-tests/device-atlas-api/smoke-test.js',
        when: 'manual',
        parallel: 1,
    },
    'sf-api-load-test': {
        ciImage: 'docker-public.dev.docker.env.works/b2d-grafana-k6',
        ciTag: 'k8s-linux-docker-runner',
        script: 'k6 run backend/vanilla/load-tests/shared-features-api/load-test.js',
        when: 'manual',
        parallel: 32,
    },
    'sf-api-smoke-test': {
        ciImage: 'docker-public.dev.docker.env.works/b2d-grafana-k6',
        ciTag: 'k8s-linux-docker-runner',
        script: 'k6 run backend/vanilla/load-tests/shared-features-api/smoke-test.js',
        when: 'manual',
        parallel: 1,
    },
};
