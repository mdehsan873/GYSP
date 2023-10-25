import React from "react";
import PriceCard from "./PriceCard";

function PriceTable() {
  
  return (
    <section className="container mt-28 text-center">
      <h3 className="text-[32px] font-bold">Price Table</h3>
      <p className="font-medium">We offer competitive price</p>

      <div className="mt-11 grid gap-8 md:gap-5 md:grid-cols-3 lg:gap-8 xl:gap-16 justify-center">
        <PriceCard
          title="Student"
          description="This plan is available for individual students."
          price="50"
          operators = "2"
          type = "Month"
        />
        <PriceCard
          title="Institutional"
          description="This plan is available for School"
          price="30"
          operators = "5+"
          type = "Month"
        />
        <PriceCard
          title="Institutional"
          description="This plan is available for School"
          price="300"
          operators = "10+"
          type = "Year"
        />
      </div>
    </section>
  );
}

export default PriceTable;
