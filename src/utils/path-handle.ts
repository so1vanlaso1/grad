// Helper function to format names (capitalize first letter of each word)
export const formatName = (name: string) => {
  if (!name) return "friend";
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getNameFromPath = () => {
  const pathSegments = window.location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Check if there is a type prefix (e.g., lec_, toho_, capstone_)
  if (!lastSegment || lastSegment === "") {
    return { type: "generic", name: "friend" };
  }

  // Check for different prefixes
  if (lastSegment.startsWith("lec_")) {
    const name = lastSegment.substring(4);
    // Format lecturer name (mr.john -> Mr. John)
    let prefix = "";
    if (name.toLowerCase().startsWith("mr.")) {
      prefix = "Mr. ";
      const formattedName =
        prefix + name.substring(3).charAt(0).toUpperCase() + name.substring(4);
      return { type: "lecturer", name: formattedName };
    } else if (name.toLowerCase().startsWith("ms.")) {
      prefix = "Ms. ";
      const formattedName =
        prefix + name.substring(3).charAt(0).toUpperCase() + name.substring(4);
      return { type: "lecturer", name: formattedName };
    }
    return { type: "lecturer", name: formatName(name) };
  }

  if (lastSegment.startsWith("toho_")) {
    return { type: "toho", name: formatName(lastSegment.substring(5)) };
  }

  if (lastSegment.startsWith("capstone_")) {
    return { type: "capstone", name: formatName(lastSegment.substring(9)) };
  }

  if (lastSegment.startsWith("best_")) {
    return { type: "best", name: formatName(lastSegment.substring(5)) };
  }

  // If no prefix, it's just a friend's name
  return { type: "friend", name: formatName(lastSegment) };
};

export const generateGraduationMessage = () => {
  const { name, type } = getNameFromPath();
  return {
    name: type === "generic" ? "Hello," : `Dear ${name},`,
    message: "I’m Thùy Dung. I’d love for you to celebrate my graduation with me and look back on some of the memories from my time at university.",
  };
};
