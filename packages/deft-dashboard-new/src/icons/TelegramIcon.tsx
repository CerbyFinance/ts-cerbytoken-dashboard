function TelegramIcon({ className }: { className: String }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23.002"
      height="18.828"
      viewBox="0 0 23.002 18.828"
      className={`${className} fill-current`}
    >
      <path
        id="Path_52"
        data-name="Path 52"
        d="M23.766,12.161a11.4,11.4,0,0,0-.314,1.318q-1.3,5.964-2.589,11.921l-.637,2.953a2.089,2.089,0,0,1-.235.616.942.942,0,0,1-1.124.462,1.943,1.943,0,0,1-.686-.315L13.2,25.532c-.134-.1-.209-.1-.33.015-.836.8-1.689,1.587-2.524,2.383a1.336,1.336,0,0,1-.777.382c-.127.017-.165,0-.156-.147q.194-2.465.355-4.929a.427.427,0,0,1,.163-.315q4.8-4.221,9.579-8.448c.111-.1.3-.2.194-.372s-.293-.092-.453-.05a1.349,1.349,0,0,0-.388.191q-5.934,3.648-11.88,7.309a.376.376,0,0,1-.347.053q-2.509-.778-5.018-1.541a1.711,1.711,0,0,1-.652-.328.484.484,0,0,1-.2-.347A.476.476,0,0,1,.9,19.013a1.8,1.8,0,0,1,.806-.538Q4.2,17.531,6.684,16.6L22.17,10.774a1.706,1.706,0,0,1,.565-.124.961.961,0,0,1,.676.225.88.88,0,0,1,.312.616c.048.1-.02.216.039.317Z"
        transform="translate(-0.764 -10.648)"
        // fill={`${theme === "light" ? "#8d97a0" : "#646464"}`}
      />
    </svg>
  );
}

export default TelegramIcon;
