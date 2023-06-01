import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Image,
} from "@chakra-ui/react";

const getdata = async (page, srt, Currency) => {
  let res = await axios.get(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${Currency}&page=${page}&per_page=10&order=market_cap_${srt}`
  );
  return res.data;
};

export default function CoinList() {
  const [data, setData] = useState([]);
  const [page, setpage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalData, setModalData] = useState({});
  const [Currency, setCurrency] = useState("INR");
  const [que, setque] = useState("");
  const [srt, setsrt] = useState("desc");

  const handleModal = (el) => {
    setModalData(el);
    onOpen();
  };

  useEffect(() => {
    getdata(page, srt, Currency).then((res) => {
      setData(res);
      //   console.log(res);
    });
  }, [page, srt, Currency]);

  const handleSearch = async () => {
    let res = await axios.get(
      `https://api.coingecko.com/api/v3/search?query=${que}`
    );
    setData(res.data.coins);
    console.log(res.data.coins);
  };

  return (
    <div>
      <button onClick={() => setpage((prev) => prev - 1)} disabled={page === 1}>
        prev
      </button>
      <button disabled>{page}</button>
      <button onClick={() => setpage((prev) => prev + 1)}>next</button>

      <input
        type="text"
        placeholder="Search by coin"
        onChange={(e) => setque(e.target.value)}
        value={que}
      />
      <button onClick={() => handleSearch()}>Search</button>

      <button onClick={() => setsrt("asc")}>Sort by Low to High</button>
      <button onClick={() => setsrt("desc")}>Sort by High to Low</button>

      <select onChange={(e) => setCurrency(e.target.value)}>
        <option>Select Coin</option>
        <option value={"INR"}>INR</option>
        <option value={"USD"}>USD </option>
        <option value={"EUR"}>EUR </option>
      </select>
      <table>
        <thead>
          <tr>
            <td>Coin</td>
            <td>Price</td>
            <td>24h Change</td>
            <td>Market Cap</td>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((el) => {
              return (
                <tr onClick={() => handleModal(el)} key={el.id}>
                  <td>
                    <img src={el.image} alt={el.name} />
                    <h3>{el.name}</h3>
                    <p>{el.symbol}</p>
                  </td>
                  <td>{el.current_price}</td>
                  <td>
                    {Number.parseFloat(el.price_change_percentage_24h).toFixed(
                      2
                    )}
                  </td>
                  <td>{el.market_cap}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          width={"50%"}
          margin={"auto"}
          _focus={true}
          boxShadow={(0, 0, 0, 0.24)}
        >
          <ModalHeader fontSize={"25px"} fontWeight={"bold"}>
            {modalData.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h3>Market Cap Rank:- {modalData.market_cap_rank}</h3>
            <Image src={modalData.image} />
            <h3>{modalData.name}</h3>
            <p>{modalData.symbol}</p>
            <p>Price:- {modalData.current_price}</p>
            <p>Price Change 24 Hour:-{modalData.price_change_24h}</p>
            <p>Total Volume:- {modalData.total_volume}</p>
            <p>Low 24 hour :- {modalData.low_24h}</p>
            <p>High 24 Hour :- {modalData.high_24h}</p>
            <p>Total Supply:- {modalData.total_supply}</p>
            <p>Max Supply:- {modalData.max_supply}</p>
            <p>Circulating Supply:- {modalData.circulating_supply}</p>
            <p>All Time High:- {modalData.ath}</p>
            <p>Last Updated Date:- {modalData.last_update}</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
