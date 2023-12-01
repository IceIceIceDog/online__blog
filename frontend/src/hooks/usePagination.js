import { useMemo } from "react";
import useResize from './useResize';

export const usePagination = (totalCount, limit, currentPage) => {
     
    const currentWidth = useResize();
    
    const totalPages = useMemo(() => {
       const pageCount = Math.ceil(totalCount / limit);
       
       let pages = [];
       
       const maxVisibleForHightWidth = 6;

       const pagesToSkipForHightWidth = 2;

       const maxVisibleForLowWidth = 3;

       const pagesToSkipForLowWidth = 1;
       
       const skipChar = '...';

       for (let i = 0; i < pageCount; i++){
          pages[i] = i + 1;
       }
       

     const currPage = currentPage + 1;

     if (currentWidth > 410) {
      if (currPage < maxVisibleForHightWidth && pages.length <= maxVisibleForHightWidth) return pages;

      if (currPage < maxVisibleForHightWidth && pages.length > maxVisibleForHightWidth) {
       let begin = [...pages].splice(0, maxVisibleForHightWidth);
       return [...begin, skipChar, ...[...pages].splice(pages.length - pagesToSkipForHightWidth, pagesToSkipForHightWidth)];
      }
 
      if ((currPage === maxVisibleForHightWidth && pages.length > maxVisibleForHightWidth) || (currPage > maxVisibleForHightWidth && pages.length - currPage >= maxVisibleForHightWidth)) {
        let begin = [...pages].splice(0, pagesToSkipForHightWidth);
        return [...begin, skipChar,  ...[...pages].splice(currPage - 2,  pagesToSkipForHightWidth * 2), skipChar, ...[...pages].splice(pages.length - pagesToSkipForHightWidth, pagesToSkipForHightWidth)];
      }

 
      if (currPage > maxVisibleForHightWidth && (pages.length - currPage < maxVisibleForHightWidth)){
       let begin = [...pages].splice(0, pagesToSkipForHightWidth);
       return [...begin, skipChar, ...[...pages].splice(pages.length - maxVisibleForHightWidth, maxVisibleForHightWidth)];
      }  

     }

     else {
      if (currPage <= maxVisibleForLowWidth && pages.length <= maxVisibleForLowWidth) return pages;

      if (currPage < maxVisibleForLowWidth && pages.length > maxVisibleForLowWidth){
          let begin = [...pages].splice(0, maxVisibleForLowWidth);
          return [...begin, skipChar, ...[...pages].splice(pages.length - 2, pages.length)];
      }

      if (currPage === maxVisibleForLowWidth || currPage - maxVisibleForLowWidth <= 1) {
        let begin = [...pages].splice(0, maxVisibleForLowWidth  + (currPage - maxVisibleForLowWidth) + 1);

        return [...begin, skipChar, ...[...pages].splice(pages.length - 2, 2)];
        
      }

      if (currPage > maxVisibleForLowWidth && pages.length - currPage > maxVisibleForLowWidth) {
          let begin = [...pages].splice(0, 2);
          return [...begin, skipChar, ...[...pages].splice(currPage - pagesToSkipForLowWidth - 1, pagesToSkipForLowWidth * 2 + 1), skipChar, ...[...pages].splice(pages.length - 2, 2)]
      }

      if (currPage > maxVisibleForLowWidth && pages.length - currPage < maxVisibleForLowWidth) {
        return [
          ...[...pages].splice(0, 2),
          skipChar, 
          ...[...pages].splice(pages.length - maxVisibleForLowWidth, maxVisibleForLowWidth)
        ];
      }

      if (currPage > maxVisibleForLowWidth && pages.length - currPage === maxVisibleForLowWidth) {
        return [
          ...[...pages].splice(0, 2),
          skipChar, 
          ...[...pages].splice(currPage - 2, 2),
          skipChar,
          ...[...pages].splice(pages.length - 2, 2)
        ];
      }

      
     }

     
      
       
    }, [totalCount, currentPage, limit, currentWidth]);

    return totalPages;
}