import NProgress from 'nprogress'

export function useLoader(promisesArr) {
    NProgress.start()
    return Promise.all(promisesArr).finally(() => {
        NProgress.done()
    })
}