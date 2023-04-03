import tw from 'twin.macro';

export function FetchTest() {
    const handleClick = () => {
        console.log('click');
        fetch('http://localhost:3000/articles/drafts', {
            method: 'GET',
        }).then((res) => console.log(res));
    };
    return (
        <>
            <div>
                <h1>Test API connection</h1>
                <button css={tw`p-2 border bg-red-200`} onClick={handleClick}>
                    Test
                </button>
            </div>
        </>
    );
}
