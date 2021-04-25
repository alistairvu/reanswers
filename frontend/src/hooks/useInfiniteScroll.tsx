import { useEffect } from "react"
import { debounce } from "underscore"

const useInfiniteScroll = (fetchNext: Function, hasNextPage: boolean) => {
  const debouncedFetchNext = debounce(fetchNext, 1000)

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 30
      ) {
        return
      } else {
        if (hasNextPage) {
          debouncedFetchNext()
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [debouncedFetchNext, hasNextPage])
}

export default useInfiniteScroll
