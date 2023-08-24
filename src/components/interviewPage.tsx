"use client";
import { useState, useCallback } from "react";

interface Item {
  id: string;
  name: string;
  children?: Item[];
  showClose?: boolean;
}

const root: Item[] = [
  {
    id: "1",
    name: "1",
    children: [
      {
        id: "1-1",
        name: "1-1",
        children: [
          {
            id: "1-1-1",
            name: "1-1-1",
          },
          {
            id: "1-1-2",
            name: "1-1-2",
          },
          {
            id: "1-1-3",
            name: "1-1-3",
          },
          {
            id: "1-1-4",
            name: "1-1-4",
            children: [
              {
                id: "1-1-4-1",
                name: "1-1-4-1",
              },
              {
                id: "1-1-4-2",
                name: "1-1-4-2",
              },
            ],
          },
        ],
      },
      {
        id: "1-2",
        name: "1-2",
        children: [
          {
            id: "1-2-1",
            name: "1-2-1",
          },
          {
            id: "1-2-2",
            name: "1-2-2",
          },
        ],
      },
    ],
  },
];

// 深度优先搜索
const searchKey = (key: string, list: Item[]): Item | null => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === key) {
      return list[i];
    }
    const res = searchKey(key, list[i]?.children || []);
    if (res) return res;
  }
  return null;
};

const Page = () => {
  const [list, setList] = useState(root);
  const [searchVal, setSearchVal] = useState("");

  const onChange = (e) => {
    setSearchVal(e.target.value);
  };

  const onSearch = useCallback(() => {
    const res = searchKey(searchVal, root);
    setList(res ? [res] : []);
  }, [searchVal]);

  // 广度优先搜索删除
  const deleteKey = (key: string) => {
    let queue: any = [root[0]];
    while (queue.length) {
      let item = queue.shift();
      if (item.id === key) {
        root.splice(0, 1);
        return item;
      }

      const children = item?.children || [];
      for (let i = 0; i < children.length; i++) {
        if (children[i].id === key) {
          const delItem = children[i];
          children.splice(i, 1);
          return delItem;
        }
        queue.push(children[i]);
      }
    }
  };

  const onDelete = (item: Item) => {
    const res = deleteKey(item.id);
    if (res) {
      setList([...root]);
    }
  };

  const handleShowClose = (item: Item) => {
    function searchItem(id: string, list?: Item[]) {
      if (!list) {
        return;
      }

      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list[i].showClose = true;
        } else {
          list[i].showClose = false;
        }
        searchItem(id, list[i].children);
      }
    }

    setList((cacheList) => {
      let currentList = [...cacheList];
      searchItem(item.id, currentList);
      return currentList;
    });
  };

  const renderFn = (arr?: Item[]) => {
    if (!arr) return null;
    return (
      <>
        {arr.map((item) => (
          <div className="flex flex-1 flex-wrap   relative " key={item.id}>
            {item.showClose && (
              <span
                className="absolute top-[-3px] right-[-3px] text-lg border-black border w-[20px]   flex flex-1"
                onClick={() => onDelete(item)}
              >
                ×
              </span>
            )}
            <div
              className="w-full border"
              onClick={() => handleShowClose(item)}
            >
              {item.name}
            </div>
            {renderFn(item?.children)}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="p-[20px]">
      <div className="flex m-b-[40px]">
        <input className=" text-black" onChange={onChange} value={searchVal} />
        <button className="ml-[20px]" onClick={onSearch}>
          查询
        </button>
      </div>
      {renderFn(list)}
    </div>
  );
};

export default Page;
