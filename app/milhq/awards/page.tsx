import Image from "next/image";
import { Award } from "lucide-react";

type UnitAward = {
  name: string;
  image: string;
  tier: "valor" | "merit" | "service" | "campaign" | "badge" | "unit" | "marksmanship" | "device";
  description: string;
  criteria: string[];
};

const AWARDS: { category: string; subtitle: string; items: UnitAward[] }[] = [
  /* ── VALOR ── */
  {
    category: "Valor Awards",
    subtitle: "For Heroism & Gallantry in Combat",
    items: [
      {
        name: "Medal of Honor",
        image: "/insignia/awards/medalofhonor.png",
        tier: "valor",
        description: "The highest military decoration awarded by the United States. Bestowed upon members of the armed forces who distinguish themselves through conspicuous gallantry and intrepidity at the risk of life above and beyond the call of duty in actual combat.",
        criteria: ["Conspicuous gallantry and intrepidity at the risk of life", "Actions above and beyond the call of duty in combat", "Incontestable proof required", "Approved by the President of the United States"],
      },
      {
        name: "Distinguished Service Cross",
        image: "/insignia/awards/Army-Distinguished-Service-Cross-DSC-69a02199e744d.png",
        tier: "valor",
        description: "The highest award for valor within ISMG. Awarded for extraordinary action during a LIONHEART operation that directly affects mission success under extreme conditions.",
        criteria: ["Extraordinary action during an operation", "Actions above and beyond assigned duties", "Witness accounts required", "Nomination by element lead and approval by program command"],
      },
      {
        name: "Silver Star",
        image: "/insignia/awards/Silver-Star-SS-699a020b4c4b4.png",
        tier: "valor",
        description: "Awarded for gallantry in action against an enemy force. The Silver Star recognizes acts of valor that, while not warranting the Distinguished Service Cross, demonstrate exceptional courage and decisive action during combat operations.",
        criteria: ["Gallantry in action against enemy forces", "Demonstrated exceptional courage under fire", "Direct impact on mission outcome", "Two witness statements required"],
      },
      {
        name: "Distinguished Flying Cross",
        image: "/insignia/awards/Distinguished-Flying-Cross-DFC-699a08c29d005.png",
        tier: "valor",
        description: "Awarded for heroism or extraordinary achievement while participating in aerial flight. Recognizes acts of valor or outstanding airmanship during combat or hazardous aviation operations.",
        criteria: ["Heroism or extraordinary achievement in aerial flight", "Demonstrated superior airmanship under hazardous conditions", "Eyewitness accounts required", "Aviation unit commander recommendation"],
      },
      {
        name: "Bronze Star with V Device",
        image: "/insignia/awards/Bronze-Star-BSM-699a0ad77858e.png",
        tier: "valor",
        description: "Awarded for heroic achievement in combat operations. The V device distinguishes this award from the meritorious service variant, recognizing specific acts of bravery during engagements.",
        criteria: ["Heroic achievement in combat", "Actions beyond normal expectations", "Nomination with supporting evidence", "Commander approval"],
      },
      {
        name: "Soldier's Medal",
        image: "/insignia/awards/Soldier-s-Medal-SM-699a09c42099c.png",
        tier: "valor",
        description: "Awarded for heroism not involving actual conflict with an enemy. Recognizes acts of bravery during non-combat situations such as rescue operations, training accidents, or life-threatening emergencies.",
        criteria: ["Heroic act not involving enemy contact", "Risk to life clearly demonstrated", "Eyewitness accounts required", "Commander recommendation"],
      },
    ],
  },
  /* ── MERITORIOUS SERVICE ── */
  {
    category: "Meritorious Service",
    subtitle: "For Outstanding Achievement & Duty",
    items: [
      {
        name: "Distinguished Service Medal",
        image: "/insignia/awards/Army-Distinguished-Service-DSM-6999fc1392e2a.png",
        tier: "merit",
        description: "Awarded for exceptionally meritorious service in a position of significant responsibility. This decoration recognizes sustained excellence in leadership, operations planning, and unit development at the command level.",
        criteria: ["Sustained exceptional service in leadership position", "Minimum 6 months in qualifying role", "Measurable impact on unit readiness/capability", "Group commander recommendation"],
      },
      {
        name: "Defense Distinguished Service Medal",
        image: "/insignia/awards/Defense-Distinguished-Service-DDSM-6999f31c67f12.png",
        tier: "merit",
        description: "Awarded for exceptionally meritorious service to the United States in a position of unique and great responsibility within the Department of Defense. One of the highest peacetime decorations.",
        criteria: ["Exceptionally meritorious service in DoD position", "Unique and great responsibility", "Sustained superior performance", "Secretary of Defense recommendation"],
      },
      {
        name: "Defense Superior Service Medal",
        image: "/insignia/awards/Defense-Superior-Service-DSSM-699a03f7b6167.png",
        tier: "merit",
        description: "Awarded for superior meritorious service in a position of significant responsibility within the Department of Defense. Recognizes performance that is clearly above what is normally expected.",
        criteria: ["Superior meritorious service in DoD assignment", "Position of significant responsibility", "Performance clearly above normal expectations", "Senior commander recommendation"],
      },
      {
        name: "Legion of Merit",
        image: "/insignia/awards/Legion-of-Merit-LOM-699a053fe0281.png",
        tier: "merit",
        description: "Awarded for exceptional conduct and outstanding achievement in duty performance. The Legion of Merit recognizes officers and NCOs who have gone above and beyond in their assigned roles.",
        criteria: ["Exceptional duty performance over extended period", "Demonstrated initiative beyond assigned duties", "Positive impact on multiple team members", "Senior NCO or officer recommendation"],
      },
      {
        name: "Bronze Star Medal",
        image: "/insignia/awards/Bronze-Star-BSM-699a0ad77858e.png",
        tier: "merit",
        description: "Awarded for meritorious achievement in a combat zone of operations. Unlike the V device variant, this recognizes sustained excellence in operational performance during deployments and field exercises.",
        criteria: ["Meritorious achievement during operations", "Consistent above-average performance", "Participation in qualifying FTX or campaign", "Team leader recommendation"],
      },
      {
        name: "Defense Meritorious Service Medal",
        image: "/insignia/awards/Defense-Meritorious-Service-Medal-DMSM-699a0d1732350.png",
        tier: "merit",
        description: "Awarded for non-combat meritorious achievement or service while serving in a joint activity. Recognizes exceptional performance in DoD joint assignments.",
        criteria: ["Non-combat meritorious achievement in joint assignment", "Significant contribution to joint mission", "Performance above normal expectations", "Joint commander recommendation"],
      },
      {
        name: "Meritorious Service Medal",
        image: "/insignia/awards/Meritorious-Service-Medal-MSM-699a0e0c3d7a6.png",
        tier: "merit",
        description: "Awarded for outstanding non-combat meritorious achievement or service. Recognizes significant contributions to unit training, administrative excellence, or community development within the group.",
        criteria: ["Outstanding achievement in non-combat role", "Significant contribution to unit mission", "Minimum 90 days of qualifying service", "Chain of command endorsement"],
      },
      {
        name: "Joint Service Commendation Medal",
        image: "/insignia/awards/Joint-Service-Commendation-JSCOM-699a0fbbb305e.png",
        tier: "merit",
        description: "Awarded for meritorious achievement or service while assigned to a joint activity. Recognizes commendable performance in DoD inter-service operations.",
        criteria: ["Meritorious service in joint assignment", "Commendable performance above expectations", "Joint activity commander recommendation"],
      },
      {
        name: "Army Commendation Medal",
        image: "/insignia/awards/Army-Commendation-ARCOM-699a1752d4577.png",
        tier: "merit",
        description: "Awarded for meritorious achievement, meritorious service, or acts of courage that do not meet the criteria for the award of a valor decoration. One of the most commonly awarded Army decorations.",
        criteria: ["Meritorious achievement or service", "Performance above normal duty requirements", "Specific contributions to unit mission", "Commander recommendation"],
      },
      {
        name: "Joint Service Achievement Medal",
        image: "/insignia/awards/Joint-Service-Achievement-JSAM-699a184d573d2.png",
        tier: "merit",
        description: "Awarded for meritorious service or achievement while assigned to a joint activity at a level below that required for the Joint Service Commendation Medal.",
        criteria: ["Meritorious achievement in joint assignment", "Service above normal expectations", "Joint activity supervisor recommendation"],
      },
    ],
  },
  /* ── SERVICE AWARDS ── */
  {
    category: "Service Awards",
    subtitle: "For Service & Commitment",
    items: [
      {
        name: "Army Good Conduct Medal",
        image: "/insignia/awards/Army-Good-Conduct-AGC-69a022009b444.png",
        tier: "service",
        description: "Awarded for exemplary conduct and faithful service. This medal recognizes soldiers who maintain consistently high standards of behavior, attendance, and performance over an extended period.",
        criteria: ["Minimum 6 months of continuous active service", "No disciplinary actions", "Consistent attendance record (85%+)", "Automatic upon qualification"],
      },
      {
        name: "Army Service Ribbon",
        image: "/insignia/awards/Army-Service-Ribbon-ASR-69ce37edc375b.png",
        tier: "service",
        description: "Awarded upon completion of Initial Entry Training. This is the first award most soldiers receive, marking their transition from recruit to qualified operator.",
        criteria: ["Successful completion of IET", "Awarded automatically upon graduation"],
      },
      {
        name: "Army Achievement Medal",
        image: "/insignia/awards/Army-Achievement-AAM-69a021c292f66.png",
        tier: "service",
        description: "Awarded for meritorious service or achievement that does not meet the criteria for higher decorations. Recognizes specific acts of excellence in training, operations support, or unit contributions.",
        criteria: ["Specific act of achievement or meritorious service", "Contribution above normal expectations", "Supervisor recommendation"],
      },
      {
        name: "Army Overseas Service Ribbon",
        image: "/insignia/awards/Army-Overseas-Service-Ribbon-OSR-699a1c305f677.png",
        tier: "service",
        description: "Awarded to soldiers who successfully complete a tour of overseas service. Each additional tour is recognized with a numeral device.",
        criteria: ["Successful completion of overseas tour", "Minimum deployment period met", "Awarded automatically upon qualification"],
      },
      {
        name: "NCO Professional Development Ribbon",
        image: "/insignia/awards/Army-NCO-Professional-Development-NCOPD-699a1f3c97c16.png",
        tier: "service",
        description: "Awarded for successful completion of designated NCO professional development courses. Recognizes professional military education milestones.",
        criteria: ["Completion of qualifying NCO course (BLC, ALC, SLC, or SMC)", "Awarded automatically upon graduation"],
      },
      {
        name: "Military Outstanding Volunteer Service Medal",
        image: "/insignia/awards/Military-Outstanding-Volunteer-Service-MOV-69ce37fd077b2.png",
        tier: "service",
        description: "Awarded for outstanding and sustained voluntary community service. Recognizes soldiers who make meaningful contributions to their communities through sustained volunteer activities.",
        criteria: ["Substantial volunteer service to community", "Service performed over sustained period", "Direct positive impact on community", "Commander recommendation"],
      },
      {
        name: "Humanitarian Service Medal",
        image: "/insignia/awards/Humanitarian-Service-Medal-HSM-699a20f5a9280.png",
        tier: "service",
        description: "Awarded to soldiers who directly participated in a designated humanitarian operation. Recognizes selfless service during disaster relief, humanitarian assistance, or emergency response.",
        criteria: ["Participation in designated humanitarian operation", "Direct contribution to relief efforts", "Awarded automatically to qualifying participants"],
      },
      {
        name: "National Defense Service Medal",
        image: "/insignia/awards/National-Defense-Service-Medal-NDSM-69ce380daeafb.png",
        tier: "service",
        description: "Awarded to all members who serve during a designated national emergency or conflict period. This campaign medal recognizes participation during times of national crisis.",
        criteria: ["Active status during qualifying period", "Awarded automatically to all active members"],
      },
      {
        name: "Armed Forces Service Medal",
        image: "/insignia/awards/Armed-Forces-Service-Medal-AFSM-699a219573596.png",
        tier: "service",
        description: "Awarded for participation in a designated US military operation that does not encounter foreign armed opposition or imminent hostile action. Recognizes significant non-combat operational service.",
        criteria: ["Participation in qualifying military operation", "Service in designated area of operations", "Awarded automatically upon qualification"],
      },
      {
        name: "Global War on Terrorism Service Medal",
        image: "/insignia/awards/Global-War-on-Terrorism-Service-GWOTS-M-699a22561558c.png",
        tier: "service",
        description: "Awarded to soldiers who performed service in support of the Global War on Terrorism operations on or after 11 September 2001. Covers stateside and support operations.",
        criteria: ["Active service supporting GWOT operations", "Service on or after 11 September 2001", "Awarded automatically upon qualification"],
      },
    ],
  },
  /* ── CAMPAIGN & DEPLOYMENT ── */
  {
    category: "Campaign & Deployment",
    subtitle: "For Operational Participation",
    items: [
      {
        name: "Purple Heart",
        image: "/insignia/awards/Purple-Heart-PH-699a0bdede6e9.png",
        tier: "campaign",
        description: "Awarded to soldiers who are wounded or killed in action during combat operations. The Purple Heart is the oldest military decoration in present use, recognizing the sacrifice of those injured in the line of duty.",
        criteria: ["Wounded in action during combat operation", "Injury documented in AAR", "Medical treatment received or KIA status", "Automatic upon qualification"],
      },
      {
        name: "Air Medal",
        image: "/insignia/awards/Air-Medal-AM-699a0f1346d56.png",
        tier: "campaign",
        description: "Awarded for meritorious achievement while participating in aerial flight or for single acts of heroism during aerial operations. Recognizes both sustained performance and specific acts of valor in aviation.",
        criteria: ["Participation in aerial operations", "Meritorious achievement or heroic action", "Minimum flight hours or qualifying combat sorties", "Aviation unit commander recommendation"],
      },
      {
        name: "Global War on Terrorism Expeditionary Medal",
        image: "/insignia/awards/Global-War-on-Terrorism-Expeditionary-GWOTE-M-699a236de2648.png",
        tier: "campaign",
        description: "Awarded to soldiers who deployed to designated combat theaters in support of the Global War on Terrorism. Recognizes forward-deployed service in operational areas.",
        criteria: ["Deployment to designated GWOT theater", "Minimum 30 consecutive days or 60 non-consecutive days", "Awarded automatically upon qualification"],
      },
      {
        name: "Armed Forces Expeditionary Medal",
        image: "/insignia/awards/uh7JbbW4nw1kh7XAQjUpxug2jo1Rkx91JMswZn5n.png",
        tier: "campaign",
        description: "Awarded for participation in US military operations and encounters foreign armed opposition. Recognizes expeditionary service in designated operational areas.",
        criteria: ["Participation in qualifying US military operation", "Service in designated area encountering armed opposition", "Awarded automatically upon qualification"],
      },
      {
        name: "Korean Defense Service Medal",
        image: "/insignia/awards/Ovby9eQkJB68zvaFM6A8fuZtjJBnmkgbMHJHyRMN.png",
        tier: "campaign",
        description: "Awarded for service in the Republic of Korea or contiguous waters or airspace. Recognizes duty performed in support of the defense of South Korea.",
        criteria: ["Duty in Republic of Korea theater", "Minimum 30 consecutive days or 60 non-consecutive days", "Awarded automatically upon qualification"],
      },
    ],
  },
  /* ── UNIT AWARDS ── */
  {
    category: "Unit Awards",
    subtitle: "For Collective Unit Excellence",
    items: [
      {
        name: "Presidential Unit Citation",
        image: "/insignia/awards/tpZE2Z24IDl3rxVXj3Q1FZp59tyowXCpcZ2exRhg.png",
        tier: "unit",
        description: "The highest unit award. Awarded to units that display extraordinary heroism in action against an armed enemy. Equivalent to the Distinguished Service Cross for individuals.",
        criteria: ["Extraordinary heroism by the unit in combat", "Actions above and beyond the call of duty", "Approved by the President or Secretary of the Army"],
      },
      {
        name: "Valorous Unit Award",
        image: "/insignia/awards/TBipLHcSfOXv18Csx3hjavNvjbyJBzxu5YluygEC.png",
        tier: "unit",
        description: "Awarded to units for extraordinary heroism in action against an armed enemy. Equivalent to the Silver Star for individuals. Recognizes unit-level gallantry.",
        criteria: ["Extraordinary heroism by the unit in combat", "Gallantry above and beyond expectations", "Army-level approval required"],
      },
      {
        name: "Meritorious Unit Commendation",
        image: "/insignia/awards/GwGLm6bYDtiJ8hQckoBxvs70w1rgmloxmdMquTPD.png",
        tier: "unit",
        description: "Awarded to units for exceptionally meritorious conduct in the performance of outstanding service. Recognizes sustained unit excellence in combat or non-combat operations.",
        criteria: ["Exceptionally meritorious unit conduct", "Outstanding service performance", "Sustained excellence over qualifying period", "Army-level approval required"],
      },
      {
        name: "Army Superior Unit Award",
        image: "/insignia/awards/KTDCRAeNnspWF3VtZwU47KeNwEj7CSqmiss96D5U.png",
        tier: "unit",
        description: "Awarded to units for outstanding meritorious performance during peacetime. Recognizes units that demonstrate exceptional organizational effectiveness and mission accomplishment.",
        criteria: ["Outstanding peacetime unit performance", "Exceptional organizational effectiveness", "Significant mission accomplishment", "Department of the Army approval"],
      },
    ],
  },
  /* ── COMBAT & SPECIAL SKILL BADGES ── */
  {
    category: "Combat & Special Skill Badges",
    subtitle: "For Combat Actions & Specialized Qualifications",
    items: [
      {
        name: "Combat Infantryman Badge",
        image: "/insignia/awards/ngewBvYY762iczHjmcv48W4ukUyxYwJFsKmuDa55.png",
        tier: "badge",
        description: "Awarded to infantry soldiers who personally fought in active ground combat while assigned to an infantry unit. One of the most respected badges in the Army.",
        criteria: ["MOS 11-series or infantry officer", "Personal engagement in ground combat", "Assigned to infantry unit during combat", "Commander verification required"],
      },
      {
        name: "Combat Infantryman Badge — 2nd Award",
        image: "/insignia/awards/zbHU1JOteUAPv80gI7zkibnsPtjL75tMO40cLNsn.png",
        tier: "badge",
        description: "Second award of the CIB, denoted by a star above the wreath. Recognizes ground combat participation in a second qualifying conflict or war.",
        criteria: ["Prior CIB recipient", "Ground combat in separate qualifying conflict", "Commander verification required"],
      },
      {
        name: "Combat Infantryman Badge — 3rd Award",
        image: "/insignia/awards/3dcolkPhelwZICNJ88YHmRXgXfmHnUAeUlutL4gH.png",
        tier: "badge",
        description: "Third award of the CIB, denoted by two stars above the wreath. Extremely rare; recognizes ground combat in three separate qualifying conflicts.",
        criteria: ["Prior 2nd Award CIB recipient", "Ground combat in third qualifying conflict", "Commander verification required"],
      },
      {
        name: "Expert Infantryman Badge",
        image: "/insignia/awards/GDiheaNBTnc9hi5ii8XZi7FjOc6yJ8DV7QlcAx3O.png",
        tier: "badge",
        description: "Awarded to infantry soldiers who demonstrate expert proficiency in infantry skills through rigorous testing. The non-combat counterpart to the CIB.",
        criteria: ["MOS 11-series or infantry officer", "Pass all EIB testing lanes", "Physical fitness and land navigation requirements", "Annual testing opportunity"],
      },
      {
        name: "Combat Action Badge",
        image: "/insignia/awards/uLFFsj18RdMCCc9GVnyKzwN25DDPLM6fG4m8NFAj.png",
        tier: "badge",
        description: "Awarded to soldiers who personally engage or are engaged by the enemy during combat operations. Available to all branches not eligible for the CIB or CMB.",
        criteria: ["Non-infantry/non-medical MOS", "Personal engagement in ground combat", "Commander verification required"],
      },
      {
        name: "Combat Action Badge — 2nd Award",
        image: "/insignia/awards/N8ljtw5soK0xdWvfVgSV5L07XWTvhinsyO7VVEav.png",
        tier: "badge",
        description: "Second award of the CAB, denoted by a star above. Recognizes combat action in a second qualifying conflict.",
        criteria: ["Prior CAB recipient", "Combat action in separate qualifying conflict", "Commander verification required"],
      },
      {
        name: "Combat Action Badge — 3rd Award",
        image: "/insignia/awards/BOSehPZHAGlE9AdqbRCFiHC8cX7ooLgxnCRA45aX.png",
        tier: "badge",
        description: "Third award of the CAB, denoted by two stars above. Recognizes combat action in three separate qualifying conflicts.",
        criteria: ["Prior 2nd Award CAB recipient", "Combat action in third qualifying conflict", "Commander verification required"],
      },
      {
        name: "Combat Medical Badge",
        image: "/insignia/awards/XOcL7fuH43oEviHaGrIJM1pvioTYw9xPXePtiej8.png",
        tier: "badge",
        description: "Awarded to medical soldiers who provided medical care while under fire. The medical counterpart to the CIB.",
        criteria: ["Medical MOS (68-series)", "Provided medical care under hostile fire", "Assigned to medical unit in combat zone", "Commander verification required"],
      },
      {
        name: "Combat Medical Badge — 2nd Award",
        image: "/insignia/awards/Y0yYUytMNuUXxvmrwiyA7sJMpBbOH590mgqLMLxe.png",
        tier: "badge",
        description: "Second award of the CMB, denoted by a star above the wreath. Recognizes medical care under fire in two separate qualifying conflicts.",
        criteria: ["Prior CMB recipient", "Medical care under fire in second qualifying conflict", "Commander verification required"],
      },
      {
        name: "Expert Field Medical Badge",
        image: "/insignia/awards/DHzzqF3N0a3z7F9rlrKLo9ttRpWH0npGqQAzFQ5m.png",
        tier: "badge",
        description: "Awarded to medical soldiers who demonstrate expert proficiency in field medical skills through rigorous testing. The non-combat counterpart to the CMB.",
        criteria: ["Medical MOS (68-series)", "Pass all EFMB testing stations", "Physical fitness and tactical proficiency", "Annual testing opportunity"],
      },
      {
        name: "Air Assault Badge",
        image: "/insignia/awards/OT67J96ykia5WwuQSt5lqIRd0ZmpYUdfHOq3t7c6.png",
        tier: "badge",
        description: "Awarded upon completion of the Air Assault Course. Recognizes proficiency in rappelling, sling load operations, and airmobile tactics.",
        criteria: ["Completion of 10-day Air Assault Course", "Pass physical fitness assessment", "Pass all graded events including 12-mile foot march", "Awarded automatically upon graduation"],
      },
      {
        name: "Basic Parachutist Badge",
        image: "/insignia/awards/DZREc7w1vbzlkwdbrYVajyFS4zp2MsUgU8IRiM0j.png",
        tier: "badge",
        description: "Awarded upon completion of Airborne School. Recognizes qualification as a military parachutist with a minimum of five qualifying jumps.",
        criteria: ["Completion of three-week Airborne Course", "Minimum 5 qualifying static-line jumps", "Awarded automatically upon graduation"],
      },
      {
        name: "Senior Parachutist Badge",
        image: "/insignia/awards/Z3wjdgHfHHtIyzmHhJzp5DNidMgQBwPTRa5EiR7D.png",
        tier: "badge",
        description: "Awarded to parachutists who have completed a minimum of 30 jumps, including 15 with combat equipment, and have served in airborne status for 24 months.",
        criteria: ["Minimum 30 qualifying jumps", "15 jumps with combat equipment", "24 months in airborne status", "Jumpmaster or equivalent qualification"],
      },
      {
        name: "Master Parachutist Badge",
        image: "/insignia/awards/yge0MNJRT1ZcGDfh1zkDhO10zwAiBql2uEDJBJGu.png",
        tier: "badge",
        description: "The highest parachutist qualification. Awarded to parachutists with 65+ jumps, 25 with combat equipment, and 36+ months in airborne status. Denoted by star and wreath above canopy.",
        criteria: ["Minimum 65 qualifying jumps", "25 jumps with combat equipment", "36 months in airborne status", "Graduated Jumpmaster Course"],
      },
      {
        name: "Parachutist Badge with Combat Jump Star",
        image: "/insignia/awards/8N9ocFSxwBtdnLDZPFIqDJDnJyi1lbde906f7K1f.png",
        tier: "badge",
        description: "Any level parachutist badge with a bronze combat star, denoting participation in a combat parachute jump into a hostile zone.",
        criteria: ["Qualified parachutist", "Participated in combat parachute operation", "Jump into designated hostile zone", "Awarded automatically upon qualification"],
      },
      {
        name: "Army Aviator Badge — Basic",
        image: "/insignia/awards/661Ew3d1IQs94nWFCsUZv46ZjazGgNqNPOhoPr5s.png",
        tier: "badge",
        description: "Awarded to Army pilots who have completed the Aviation qualification course. Recognizes basic qualification as a rated Army aviator.",
        criteria: ["Completion of Army Aviation course", "Qualified as rated Army aviator", "Awarded automatically upon graduation"],
      },
      {
        name: "Army Aviator Badge — Senior",
        image: "/insignia/awards/6QeBd0gdPRiwvtFOLpWAbZbAd2NHynh2CWuGCTY3.png",
        tier: "badge",
        description: "Awarded to Army aviators who have accumulated significant flight hours and experience. Denoted by a star above the shield.",
        criteria: ["Basic Aviator Badge holder", "Minimum qualifying flight hours", "Sustained performance in aviation assignment"],
      },
      {
        name: "Army Aviator Badge — Master",
        image: "/insignia/awards/HA4KSHyWjzhLITqpZYhBX0xooB0rFLtoS5JlreHz.png",
        tier: "badge",
        description: "The highest Army aviator qualification. Awarded for extensive flight experience and sustained superior performance. Denoted by star and wreath above shield.",
        criteria: ["Senior Aviator Badge holder", "Extensive qualifying flight hours", "Sustained superior aviation performance", "Senior commander recommendation"],
      },
      {
        name: "Army Aircrew Badge",
        image: "/insignia/awards/wEHfpvlozjUZdQ9eDH3GA1oFJyr8bA2v8xsiNLJz.png",
        tier: "badge",
        description: "Awarded to non-rated crewmembers who serve as flight crew aboard Army aircraft. Recognizes qualification as an Army flight crewmember.",
        criteria: ["Completion of flight crewmember course", "Qualified as non-rated crewmember", "Active flight duty assignment"],
      },
      {
        name: "French Fourragère",
        image: "/insignia/awards/BAegToZoacCegjowiUj1hYZDjDGoybHTrJtMFhGu-removebg-preview-693497fd1e113.png",
        tier: "badge",
        description: "A braided cord awarded to units cited for distinguished service by the French government. The fourragère is worn on the left shoulder by all members of the cited unit. It is a prestigious foreign unit decoration with deep historical significance.",
        criteria: ["Assigned to a unit awarded the French Fourragère", "Worn while serving with the cited unit", "Authorized by unit lineage and honors"],
      },
    ],
  },
  /* ── MARKSMANSHIP ── */
  {
    category: "Marksmanship Qualifications",
    subtitle: "For Weapons Proficiency",
    items: [
      {
        name: "Expert Qualification Badge — Rifle",
        image: "/insignia/awards/OzqUQghMHm2tftxhUcRYNHDkqgTlaTJ9gZK9qciE.png",
        tier: "marksmanship",
        description: "The highest marksmanship qualification. Awarded to soldiers who achieve Expert-level scores during weapons qualification. Distinguished by the Maltese cross design.",
        criteria: ["Score 36-40 hits out of 40 on rifle qualification", "Annual requalification required"],
      },
      {
        name: "Sharpshooter Qualification Badge — Rifle",
        image: "/insignia/awards/d2j6HF1yZDdIZMAjhYnfXDm4C21kjE8YRO4mHEZ5.png",
        tier: "marksmanship",
        description: "Awarded to soldiers who achieve Sharpshooter-level scores during weapons qualification. The intermediate level between Marksman and Expert.",
        criteria: ["Score 30-35 hits out of 40 on rifle qualification", "Annual requalification required"],
      },
      {
        name: "Marksman Qualification Badge — Rifle",
        image: "/insignia/awards/B8Zuy3fcSqd7F2VdlYKsiDhqLDWNrDZKfod73C6R.png",
        tier: "marksmanship",
        description: "Awarded to soldiers who achieve the minimum qualifying score during weapons qualification. The basic level of marksmanship proficiency.",
        criteria: ["Score 23-29 hits out of 40 on rifle qualification", "Annual requalification required"],
      },
    ],
  },
  /* ── RIBBON DEVICES & ACCESSORIES ── */
  {
    category: "Ribbon Devices & Accessories",
    subtitle: "Denoting Additional Awards & Service",
    items: [
      {
        name: "V Device (Valor)",
        image: "/insignia/awards/d0YUOgcWa3vDL9k9cqsfMU7e79NrRC1uXBxVRoUY.png",
        tier: "device",
        description: "Bronze letter V worn on ribbons to denote valor. Distinguishes awards earned through acts of heroism in combat from those earned for meritorious service.",
        criteria: ["Awarded in conjunction with qualifying decoration", "Denotes combat valor distinction"],
      },
      {
        name: "C Device (Combat)",
        image: "/insignia/awards/RyRuGfjlFNxUXWcj57xBgrRDqJdvDKO4elMgbxLR.png",
        tier: "device",
        description: "Gold letter C worn on ribbons to denote meritorious service or achievement in a combat zone. Distinguishes combat-zone awards from garrison service.",
        criteria: ["Awarded in conjunction with qualifying decoration", "Denotes service in combat zone without direct valor"],
      },
      {
        name: "R Device (Remote)",
        image: "/insignia/awards/RbXAH9jRnOqq8BfgEqhpE5CwWFkGEumGjdwLggfv.png",
        tier: "device",
        description: "Bronze letter R worn on ribbons to denote direct impact on combat operations performed remotely. Recognizes remote contributions to the fight.",
        criteria: ["Awarded in conjunction with qualifying decoration", "Denotes remote contribution to combat operations"],
      },
      {
        name: "Oak Leaf Clusters",
        image: "/insignia/awards/QXVJojiGGKVBFDl4qovEqesAgmfvlmNYvY5zSUOO.png",
        tier: "device",
        description: "Worn on Army ribbons to denote subsequent awards of the same decoration. Bronze clusters represent one additional award; a silver cluster represents five.",
        criteria: ["Subsequent award of the same decoration", "Bronze = 1 additional award", "Silver = 5 additional awards"],
      },
      {
        name: "Service Stars",
        image: "/insignia/awards/5RKRBhXNX2D7qM6dCyesjPFUIpyTv1X289Jvl7r2.png",
        tier: "device",
        description: "Worn on campaign and service ribbons to denote participation in specific campaigns or operations. Bronze stars represent one campaign; silver represents five.",
        criteria: ["Participation in designated campaign or operation", "Bronze star = 1 campaign", "Silver star = 5 campaigns"],
      },
      {
        name: "Arrowhead Device",
        image: "/insignia/awards/Cg7PNXA1njuBZBRaDGDbRDmqEuHfEwg1vH57AFtN.png",
        tier: "device",
        description: "Bronze arrowhead worn on campaign ribbons to denote participation in an airborne, amphibious, or helicopter assault landing.",
        criteria: ["Participation in qualifying airborne, amphibious, or air assault landing", "Worn on applicable campaign ribbon"],
      },
      {
        name: "Overseas Service Bars",
        image: "/insignia/awards/JkcBFFyageN1ltFPlwlEgbcVHSPWNyt0n8y9m4DI.png",
        tier: "device",
        description: "Worn on the dress uniform sleeve. Each bar represents six months of overseas service in a designated theater. Available in gold (WWII), bronze, and silver variants.",
        criteria: ["Six months of overseas service per bar", "Service in designated theater of operations"],
      },
    ],
  },
];

const TIER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  valor:        { bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.2)",  text: "#ef4444" },
  merit:        { bg: "rgba(201,161,40,0.08)",  border: "rgba(201,161,40,0.2)", text: "#c9a128" },
  service:      { bg: "rgba(26,122,112,0.08)",  border: "rgba(26,122,112,0.2)", text: "#1a9a8a" },
  campaign:     { bg: "rgba(184,152,88,0.08)",  border: "rgba(184,152,88,0.2)", text: "#b89858" },
  unit:         { bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.2)", text: "#818cf8" },
  badge:        { bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.2)",  text: "#4ade80" },
  marksmanship: { bg: "rgba(168,162,158,0.08)", border: "rgba(168,162,158,0.2)", text: "#a8a29e" },
  device:       { bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.2)",  text: "#f59e0b" },
};

function AwardCard({ award }: { award: UnitAward }) {
  const color = TIER_COLORS[award.tier];
  return (
    <div className="bg-[#0f120a] border border-[#1c2014] rounded-lg overflow-hidden hover:border-[#252a1c] transition-colors">
      <div className="flex items-start gap-5 p-5">
        <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" style={{
          backgroundColor: color.bg, border: `1px solid ${color.border}`,
        }}>
          <Image src={award.image} alt={award.name} width={52} height={52} className="object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-black" style={{ color: "#e8e4d8" }}>{award.name}</h3>
            <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded" style={{
              color: color.text, backgroundColor: color.bg,
            }}>{award.tier}</span>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "#8a8870" }}>{award.description}</p>
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-1.5" style={{ color: "#6b6a58" }}>Eligibility & Criteria</p>
            <ul className="space-y-1">
              {award.criteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#6b6a58" }}>
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color.text }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AwardsPage() {
  return (
    <div className="bg-[#090b07] text-[#e8e4d8]">
      {/* Header */}
      <section className="relative py-20 px-6 overflow-hidden bg-black-mc grain" style={{ borderBottom: "1px solid #1c2014" }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "linear-gradient(#c9a128 1px, transparent 1px), linear-gradient(90deg, #c9a128 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4" style={{ color: "#c9a128" }} />
            <p className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: "#c9a128" }}>Military Headquarters</p>
          </div>
          <h1 className="text-5xl font-black mb-4" style={{ color: "#e8e4d8" }}>Awards & Decorations</h1>
          <p className="max-w-xl leading-relaxed" style={{ color: "#8a8870" }}>
            Awards, decorations, badges, and devices authorized by the LIONHEART Program. Personnel may be nominated by their element leadership for service, achievement, and valor.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {Object.entries(TIER_COLORS).map(([tier, color]) => (
              <span key={tier} className="text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded" style={{
                color: color.text, backgroundColor: color.bg, border: `1px solid ${color.border}`,
              }}>{tier}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {AWARDS.map((cat) => (
        <section key={cat.category} className="py-12 px-6 border-t border-[#1c2014]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#c9a128" }} />
              <div>
                <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: "#c9a128" }}>{cat.subtitle}</p>
                <h2 className="text-xl font-black" style={{ color: "#e8e4d8" }}>{cat.category}</h2>
              </div>
              <div className="h-px flex-1" style={{ backgroundColor: "#1c2014" }} />
              <span className="text-sm font-black" style={{ color: "#8a8870" }}>{cat.items.length}</span>
            </div>
            <div className="space-y-4">
              {cat.items.map((a) => <AwardCard key={a.name} award={a} />)}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
