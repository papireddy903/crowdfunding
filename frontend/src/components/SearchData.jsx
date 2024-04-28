const url = "http://127.0.0.1:8000/api/projects/";
const [data, setData] = useState([]);

const fetchData = () => {
  return fetch(url)
    .then((res) => res.json())
    .then((d) => setData(d));
};

useEffect(() => {
  fetchData();
}, []);

return (
  <center>
    {data.map((dataObj) => {
      return (
        <div className="box">
          <div class="card">
            <div class="category">@{dataObj.title} </div>
            <div class="heading">
              {dataObj.description}
              <div class="author">{dataObj.percentage_funded}</div>
            </div>
          </div>
        </div>
      );
    })}
  </center>
);
