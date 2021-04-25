import { useEffect } from "react"
import { debounce } from "underscore"

const useInfiniteScroll = (fetchNextPage: Function, hasNextPage: boolean) => {
  const debouncedFetchNextPage = debounce(() => fetchNextPage(), 1000)
  console.log({ hasNextPage })

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 30
      ) {
        return
      } else {
        if (hasNextPage) {
          debouncedFetchNextPage()
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [debouncedFetchNextPage, hasNextPage])
}

export default useInfiniteScroll
