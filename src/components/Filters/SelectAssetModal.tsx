import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import AssetOptions from './AssetOptions';
import { observer } from 'mobx-react';

const Container = styled.div`
    display: block;
    position: fixed;
    z-index: 5;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
`;

const ModalContent = styled.div`
    margin: 15% auto;
    display: flex;
    flex-direction: column;
    max-width: 554px;
    max-height: 449px;
    background-color: var(--panel-background);
    border: 1px solid var(--panel-border);
    border-radius: 4px;
    color: white;
`;

const AssetSelectorHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 68px;
    padding: 0px 20px;
    background-color: var(--panel-header-background);
    color: var(--header-text);
    border-radius: 4px;
    border-bottom: 1px solid var(--panel-border);
`;

const HeaderContent = styled.div``;

const ExitComponent = styled.div`
    color: var(--exit-modal-color);
    transform: rotate(135deg);
    font-size: 22px;
    cursor: pointer;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0px 20px;
    justify-content: space-between;
    color: var(--body-text);
    padding-left: 21px;
    padding-right: 21px;
    border-bottom: 1px solid var(--panel-border);
    input {
        width: 75%;
        color: var(--body-text);
        font-size: 16px;
        line-height: 19px;
        background-color: var(--panel-background);
        border: none;
        box-shadow: inset 0 0 0 1px var(--panel-background),
            inset 0 0 0 100px var(--panel-background);
        :-webkit-autofill,
        :-webkit-autofill:hover,
        :-webkit-autofill:focus,
        :-webkit-autofill:active,
        :-internal-autofill-selected {
            -webkit-text-fill-color: var(--body-text);
        }
        :focus {
            outline: none;
        }
    }
`;

function useOnClickOutside(ref, handler) {
    useEffect(() => {
        const handleClick = event => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }

            handler(event);
        };

        const handleKeyUp = event => {
            if (event.key !== 'Escape') {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', handleClick);
        window.addEventListener('keydown', handleKeyUp, false);
        document.addEventListener('touchstart', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            window.removeEventListener('keydown', handleKeyUp, false);
            document.removeEventListener('touchstart', handleClick);
        };
    }, [ref, handler]);
}

const SelectAssetModal = observer((props: RouteComponentProps) => {
    const ref = useRef();
    const [search, setSearch] = useState('');

    useOnClickOutside(ref, () => {
        props.onClose();
        setSearch('');
    });

    const onChange = async event => {
        const { value } = event.target;
        setSearch(value);
    };

    const selectAsset = async asset => {
        props.onSelectAsset(asset);
        props.onClose();
        setSearch('');
    };

    return (
        <Container style={{ display: props.open ? 'block' : 'none' }}>
            <ModalContent ref={ref}>
                <AssetSelectorHeader>
                    <HeaderContent>Select Token</HeaderContent>
                    <ExitComponent onClick={() => props.onClose()}>
                        +
                    </ExitComponent>
                </AssetSelectorHeader>
                <InputContainer>
                    <input
                        ref={input => input && input.focus()}
                        value={search}
                        onChange={e => onChange(e)}
                        placeholder="Search Token Name, Symbol, or Address"
                    />
                </InputContainer>
                <AssetOptions
                    onSelectAsset={selectAsset}
                    selectedAssets={props.selectedAssets}
                    search={search}
                />
            </ModalContent>
        </Container>
    );
});

export default SelectAssetModal;
