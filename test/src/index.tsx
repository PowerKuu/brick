import router from "@klevn/solid-router" 
import Bricks from "../../bricks"
import "./index.css"

import test from "./mov.mp4"

const B = Bricks({
    globalStyle: {
        "font-family": "Inter"
    },
    theme: {
        text: {
            color: "#ff0000"
        }
    }
})

router.add("/", () => {
    return (
      <B.ContainerResponsive gap={1} horizontalPadding={10}> 
        <B.FixedWrapLayout wrap={1300} gap={4} >
            <B.VerticalLayout gap={1}>
                <B.SubHeading>WEBSITE HOSTING</B.SubHeading>
               
                <B.Heading>A home for youre website.</B.Heading>

                <B.Text>
                <B.Link href="/">Lorem</B.Link> ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                maximus, felis ut commodo faucibus, odio enim porttitor neque, vitae
                viverra justo erat sed nisl. Nam tincidunt erat dolor, iaculis
                venenatis mauris rhoncus id. Donec a finibus nibh. Aliquam nunc lacus,
                ultricies eu diam porta, pellentesque fermentum orci. Phasellus sed
                vulputate odio. Integer vitae mauris ut est euismod pretium. Etiam
                consequat accumsan ipsum.
                </B.Text>
            </B.VerticalLayout>

            <B.Video src={test}></B.Video>
        </B.FixedWrapLayout>

      </B.ContainerResponsive>
    );
})

router.update()
