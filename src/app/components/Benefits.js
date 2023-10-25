import React from "react";
import BenefitItem from "./BenefitItem";
import { CheckIcon } from "@heroicons/react/solid";

function Benefits() {
  return (
    <section className="container mt-24 space-y-24">
      <BenefitItem
        image="./images/co_curricular.png"
        heading1="Co-Curricular"
        heading2=" Performance Evaluation"
        Content={() => (
          <div>
            <h5 className="mt-6 mb-2 font-semibold">Standardized Evaluation Metrics</h5>
            <p>
            Our innovative platform offers standardized methodologies to gauge a student's performance in co-curricular activities,
            providing a well-rounded view of their abilities and talents
            </p>
            <h5 className="mt-6 mb-2 font-semibold">Encouragement to Diversity:</h5>
            <p>
            GYSP encourages students to venture into diverse co-curricular activities,
             fostering a balanced and enriched growth trajectory.
            </p>
          </div>
        )}
      />

      <BenefitItem
        image="./images/growth-mapping.png"
        heading1="Growth"
        heading2="Mapping"
        description="Real-time student growth mapping provides a dynamic, data-driven snapshot of each student's educational journey, fostering tailored support and personalized progress tracking."
        Content={() => (
          <div className="flex flex-col space-y-6">
           <h5 className="mt-6 mb-2 font-semibold">Subject Wise:</h5>
            <p>
            Subject-wise growth mapping enables educators to pinpoint strengths and weaknesses, empowering targeted interventions and fostering holistic academic development.
            </p>
          </div>
        )}
      />

      <BenefitItem
        image="./images/Acadmics.png"
        heading1="Academics"
        heading2="Performance Evaluation"
        description="Our Performance Evaluation tool incorporates advanced analytics, offering in-depth insights to enhance decision-making and drive continuous improvement, making it a valuable asset for assessing and optimizing performance."
        Content={() => (
          <div>
            <h5 className="mt-6 mb-2 font-semibold">Standardized Evaluation Metrics</h5>
            <p>
            Standardized evaluation metrics in student performance assessment provide a consistent framework to gauge academic achievement and growth, ensuring fairness and objectivity in the performance evaluation process.
            </p>
          </div>
        )}
      />
    </section>
  );
}

export default Benefits;

function CheckedItem({ bgColor, text }) {
  return (
    <div>
      <div className="flex items-center space-x-6">
        <div style={{ background: `${bgColor}` }} className="rounded-xl p-1.5">
          <CheckIcon className="h-8 text-white" />
        </div>
        <p>{text}</p>
      </div>
    </div>
  );
}
