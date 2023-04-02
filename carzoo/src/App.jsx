import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import logo from "./assets/logo.gif";

function App() {
  const { register, setValue, handleSubmit } = useForm();
  const {
    register: infoRegister,
    setValue: setInfoValue,
    handleSubmit: handleInfoSubmit,
  } = useForm();
  const [prediction, setPrediction] = useState("");
  const [carInfo, setCarInfo] = useState("");

  useEffect(() => {
    setValue("Year", 2015);
    setValue("Kilometers_Driven", 45000);
    setValue("Mileage", 18.2);
    setValue("Engine", 1968);
    setValue("Power", 141);
    setValue("Seats", 5);
    setValue("Owner_Type", "First");
    setValue("Location", "Mumbai");
    setValue("Fuel_Type", "Diesel");
    setValue("Transmission", "Manual");
  }, []);

  const onSubmit = (values) => {
    axios
      .post("http://localhost:5000/predictWithJson", values)
      .then((res) => {
        console.log(res.data);
        setPrediction(res.data.predicted);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const onInfoSubmit = (values) => {
    const query = `${values.Name} ${values.Year}`;
    console.log(query);
    axios
      .post("http://localhost:5000/getDetails", { query })
      .then((res) => {
        console.log(res.data);
        setCarInfo(res.data);
      })
      .catch((err) => console.error(err.message));
  };

  return (
    <>
      <header className="sticky top-0">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a href="#" className="btn btn-ghost normal-case text-2xl">
              Car <span className="text-primary">Zoo</span>
            </a>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a href="#predict-price">Predict Price</a>
              </li>
              <li>
                <a href="#vehicle-info">Vehicle Info</a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="bg-base-200 py-20 grid gap-10 px-4 lg:px-0">
        <div className="w-full flex-col items-center flex justify-center mb-10">
          <img
            src={logo}
            width={300}
            height={300}
            className="rounded-full object-cover w-72 h-72 shadow-2xl"
          />

          <h1 className="mt-5 text-5xl font-extrabold font-[Inter]">
            Car <span className="text-primary">Zoo</span>
          </h1>
        </div>
        <form
          id="predict-price"
          onSubmit={handleSubmit(onSubmit)}
          className="container mx-auto"
        >
          <div className="bg-base-100 shadow-xl p-8 py-14 grid grid-cols-2 gap-4 xs:grid-cols-1 rounded-2xl">
            <h2 className="col-span-1 md:col-span-2 text-3xl font-bold">
              <span className="text-primary">Predict</span> Price
            </h2>
            <div className="form-control">
              <label className="label">Year of Make</label>
              <input
                type="text"
                {...register("Year")}
                className="input input-bordered focus:input-primary"
              />
            </div>
            <div className="form-control">
              <label className="label">Kilometers Driven</label>
              <input
                type="text"
                {...register("Kilometers_Driven")}
                className="input input-bordered focus:input-primary"
              />
            </div>
            <div className="form-control">
              <label className="label">Mileage (kmpl)</label>
              <input
                type="text"
                {...register("Mileage")}
                className="input input-bordered focus:input-primary"
              />
            </div>
            <div className="form-control">
              <label className="label">Engine (cc)</label>
              <input
                type="text"
                {...register("Engine")}
                className="input input-bordered focus:input-primary"
              />
            </div>
            <div className="form-control">
              <label className="label">Power (bhp)</label>
              <input
                type="text"
                {...register("Power")}
                className="input input-bordered focus:input-primary"
              />
            </div>
            <div className="form-control">
              <label className="label">Seats</label>
              <input
                type="text"
                {...register("Seats")}
                className="input input-bordered focus:input-primary"
              />
            </div>
            <div className="form-control">
              <label className="label">Owner Type</label>
              {/* <input type="text" className="input input-bordered focus:input-primary" /> */}
              <select
                {...register("Owner_Type")}
                className="select select-bordered focus:select-primary"
              >
                <option value="First">First</option>
                <option value="Second">Second</option>
                <option value="Third">Third</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">Location</label>
              <select
                className="select select-bordered focus:select-primary"
                {...register("Location")}
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Punjab">Punjab</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">Fuel Type</label>
              <select
                className="select select-bordered focus:select-primary"
                {...register("Fuel_Type")}
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">Transmission</label>
              <select
                className="select select-bordered focus:select-primary"
                {...register("Transmission")}
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="form-control mt-5 md:col-span-2">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>

        <form
          id="vehicle-info"
          onSubmit={handleInfoSubmit(onInfoSubmit)}
          className="container mx-auto"
        >
          <div className="bg-base-100 shadow-xl p-8 py-14 grid gap-4 grid-cols-1 rounded-2xl">
            <h2 className="text-3xl font-bold">
              <span className="text-primary">Vehicle</span> Info
            </h2>

            <div className="form-control">
              <label className="label">Name</label>
              <input
                type="text"
                className="input input-bordered focus:input-primary"
                {...infoRegister("Name")}
              />
            </div>
            <div className="form-control">
              <label className="label">Year</label>
              <input
                type="text"
                className="input input-bordered focus:input-primary"
                {...infoRegister("Year")}
              />
            </div>
            <div className="form-control">
              <button className="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>

        {carInfo !== "" && (
          <div className="modal modal-open">
            <div className="modal-box relative">
              <label
                onClick={() => setCarInfo("")}
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <h3 className="text-2xl font-bold mt-5">
                Vehicle Specifications
              </h3>
              <table className="text-lg table table-bordered mt-4 table-zebra">
                <tbody>
                  {Object.entries(carInfo).map(([key, value], index) => (
                    <tr key={index}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {prediction !== "" && (
          <div className="modal modal-open">
            <div className="modal-box relative">
              <label
                onClick={() => setPrediction("")}
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <h3 className="text-xl font-bold">Prediction</h3>
              <p className="py-4 text-lg">
                Rs. {Math.round(prediction * 100) / 100} Lakhs
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
